import os
import uuid
import requests
import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pdf2docx import Converter
from supabase import create_client, Client
from dotenv import load_dotenv

# Load local environment variables from .env file
load_dotenv()

app = FastAPI(title="ConvertX Pro Python Worker")

# Supabase Credentials (matches Cloud instance)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("CRITICAL ERROR: SUPABASE_URL and SUPABASE_ANON_KEY environment variables must be defined inside backend/python-worker/.env!")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

class ConversionRequest(BaseModel):
    file_url: str
    target_format: str
    job_id: str

@app.post("/convert")
async def convert_document(req: ConversionRequest):
    print(f"[*] Starting conversion job {req.job_id} | Source: {req.file_url}")
    
    # Generate temporary working file paths
    temp_dir = "/tmp/convertx"
    os.makedirs(temp_dir, exist_ok=True)
    
    local_pdf_path = os.path.join(temp_dir, f"{req.job_id}.pdf")
    local_docx_path = os.path.join(temp_dir, f"{req.job_id}.docx")
    
    try:
        # 1. Download original PDF asset
        response = requests.get(req.file_url, stream=True)
        if response.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch source document from bucket.")
            
        with open(local_pdf_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        # 2. Execute vector parsing & structure reconstruction
        print(f"[*] Parsing layout structure of {req.job_id}...")
        cv = Converter(local_pdf_path)
        cv.convert(local_docx_path, start=0, pages=None)
        cv.close()
        print(f"[+] PDF successfully converted to DOCX.")
        
        # 3. Read converted file and upload to Supabase uploads bucket
        if not os.path.exists(local_docx_path):
            raise Exception("DOCX assembly failed; output file not found.")
            
        dest_filename = f"{uuid.uuid4()}.docx"
        
        with open(local_docx_path, 'rb') as f:
            file_data = f.read()
            
        # Upload using supabase client
        upload_response = supabase.storage.from_("uploads").upload(
            path=dest_filename,
            file=file_data,
            file_options={"content-type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
        )
        
        # Get public url of converted DOCX
        public_url = supabase.storage.from_("uploads").get_public_url(dest_filename)
        
        # Log entry in DB uploaded_files table
        supabase.table("uploaded_files").insert({
            "file_name": f"{req.job_id}_converted.docx",
            "file_path": dest_filename,
            "file_size": len(file_data),
            "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "source_format": "pdf"
        }).execute()
        
        print(f"[+] Completed conversion job {req.job_id} | Output: {public_url}")
        
        return {
            "success": True,
            "publicUrl": public_url,
            "filePath": dest_filename
        }
        
    except Exception as e:
        print(f"[!] Error in conversion job {req.job_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Conversion error: {str(e)}")
        
    finally:
        # Cleanup temporary files to conserve disk space
        if os.path.exists(local_pdf_path):
            os.remove(local_pdf_path)
        if os.path.exists(local_docx_path):
            os.remove(local_docx_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
