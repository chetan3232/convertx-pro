require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Queue = require('bull');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend running on localhost:8080 or other origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'apikey']
}));

app.use(express.json());

// Initialize Supabase Client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('CRITICAL ERROR: SUPABASE_URL and SUPABASE_ANON_KEY must be defined in backend/api-gateway/.env!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Setup Redis & Bull Queue with robust local in-memory fallback
const localJobs = new Map();
const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';

let conversionQueue = null;
let useRedis = true;

try {
  conversionQueue = new Queue('conversions', redisUrl);
  conversionQueue.on('error', (err) => {
    if (useRedis) {
      console.warn('[!] Redis offline. Gracefully falling back to 100% Zero-Dependency In-Memory Task Broker.');
      useRedis = false;
    }
  });
} catch (e) {
  console.warn('[!] Failed to initialize Bull queue. Using In-Memory Task Broker.');
  useRedis = false;
}

// Multer Storage Configuration
const uploadDir = path.join(__dirname, 'tmp-uploads');
const upload = multer({ 
  dest: uploadDir,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// ensure tmp directories exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ─── 1. UPLOAD & SCHEDULE CONVERSION TASK ───────────
app.post('/api/convert', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const targetFormat = req.body.target || 'docx';

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileExt = file.originalname.split('.').pop().toLowerCase();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;

    // Upload raw file to Supabase uploads bucket so the worker can fetch it
    const fileBuffer = fs.readFileSync(file.path);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(uniqueFileName, fileBuffer, {
        contentType: file.mimetype,
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }

    // Get Public URL
    const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(uniqueFileName);

    const publicUrl = urlData.publicUrl;
    let jobId;

    if (useRedis && conversionQueue) {
      try {
        // Create a conversion job in the Redis-backed Bull queue
        const job = await conversionQueue.add({
          fileUrl: publicUrl,
          fileName: file.originalname,
          targetFormat,
          fileSize: file.size,
          sourceFormat: fileExt
        }, {
          attempts: 2,
          removeOnComplete: true,
          removeOnFail: false
        });
        jobId = job.id;
        console.log(`[+] Scheduled job ${jobId} via Bull queue.`);
      } catch (redisErr) {
        console.warn('[!] Bull queue scheduling failed. Falling back to In-Memory Task Broker:', redisErr.message);
        useRedis = false;
      }
    }

    // In-memory Task Broker Fallback
    if (!useRedis || !jobId) {
      jobId = crypto.randomUUID();
      localJobs.set(jobId, {
        status: 'converting',
        progress: 30,
        fileName: file.originalname,
        targetFormat,
        fileSize: file.size,
        sourceFormat: fileExt
      });

      console.log(`[+] Scheduled job ${jobId} via In-Memory Task Broker.`);

      // Process in background synchronously calling the FastAPI python worker
      (async () => {
        // Use environment URL or fallback to localhost worker
        const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000/convert';
        try {
          console.log(`[*] In-Memory Broker: Processing job ${jobId} | Calling Python Worker...`);
          const response = await axios.post(pythonWorkerUrl, {
            file_url: publicUrl,
            target_format: targetFormat,
            job_id: String(jobId)
          }, {
            timeout: 120000 // 2 minutes
          });

          if (response.data && response.data.success) {
            console.log(`[+] In-Memory Broker: Job ${jobId} completed successfully.`);
            localJobs.set(jobId, {
              status: 'completed',
              publicUrl: response.data.publicUrl,
              filePath: response.data.filePath
            });
          } else {
            throw new Error(response.data.error || 'Worker reported unsuccessful status.');
          }
        } catch (err) {
          const errMsg = err.response && err.response.data && err.response.data.detail
            ? err.response.data.detail
            : err.message;
          console.error(`[!] In-Memory Broker: Job ${jobId} failed:`, errMsg);
          localJobs.set(jobId, {
            status: 'failed',
            error: errMsg
          });
        }
      })();
    }

    // Cleanup local Multer temp file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    return res.status(200).json({
      success: true,
      jobId: String(jobId),
      status: 'queued',
      message: 'File uploaded and conversion scheduled successfully.'
    });

  } catch (error) {
    console.error('[!] API Gateway error:', error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ error: error.message });
  }
});

// ─── 2. POLL CONVERSION JOB STATUS ──────────────────
app.get('/api/status/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Check In-Memory Store First
    const localJob = localJobs.get(jobId);
    if (localJob) {
      if (localJob.status === 'completed') {
        return res.status(200).json({
          success: true,
          status: 'done',
          progress: 100,
          publicUrl: localJob.publicUrl,
          filePath: localJob.filePath
        });
      }

      if (localJob.status === 'failed') {
        return res.status(200).json({
          success: false,
          status: 'error',
          progress: 0,
          error: localJob.error || 'Conversion failed.'
        });
      }

      return res.status(200).json({
        success: true,
        status: 'converting',
        progress: 50
      });
    }

    // 2. Check Redis Bull Queue If Available
    if (useRedis && conversionQueue) {
      const job = await conversionQueue.getJob(jobId);
      if (job) {
        const state = await job.getState();
        if (state === 'completed') {
          return res.status(200).json({
            success: true,
            status: 'done',
            progress: 100,
            publicUrl: job.returnvalue.publicUrl,
            filePath: job.returnvalue.filePath
          });
        }

        if (state === 'failed') {
          return res.status(200).json({
            success: false,
            status: 'error',
            progress: 0,
            error: job.failedReason || 'Internal conversion engine failure.'
          });
        }

        return res.status(200).json({
          success: true,
          status: state === 'active' ? 'converting' : 'queued',
          progress: state === 'active' ? 50 : 10
        });
      }
    }

    return res.status(404).json({ error: 'Job not found' });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// ─── 3. QUEUE PROCESSOR (FOR REDIS MODE) ───────────
if (conversionQueue) {
  conversionQueue.process(async (job) => {
    const { fileUrl, targetFormat } = job.data;
    console.log(`[*] Processing queue job ${job.id} | Calling Python Worker...`);

    const pythonWorkerUrl = process.env.PYTHON_WORKER_URL || 'http://localhost:8000/convert';

    try {
      const response = await axios.post(pythonWorkerUrl, {
        file_url: fileUrl,
        target_format: targetFormat,
        job_id: String(job.id)
      }, {
        timeout: 120000 // 2 minutes
      });

      if (response.data && response.data.success) {
        console.log(`[+] Queue job ${job.id} completed successfully.`);
        return {
          publicUrl: response.data.publicUrl,
          filePath: response.data.filePath
        };
      } else {
        throw new Error(response.data.error || 'Worker reported unsuccessful status.');
      }
    } catch (err) {
      const errMsg = err.response && err.response.data && err.response.data.detail
        ? err.response.data.detail
        : err.message;
      console.error(`[!] Worker failure on job ${job.id}:`, errMsg);
      throw new Error(errMsg);
    }
  });
}

// Start the Express Gateway Server
app.listen(PORT, () => {
  console.log(`[+] ConvertX Pro API Gateway active on http://localhost:${PORT}`);
});
