# ⚡ ConvertX Pro

> **"Upload any file → get the best possible output in seconds, with perfect formatting."**

[![Phase](https://img.shields.io/badge/Phase-1%20MVP-blue)](https://github.com/chetan3232/convertx-pro)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20Vite%20%2B%20Supabase-orange)](https://github.com/chetan3232/convertx-pro)

ConvertX Pro is a **fast, accurate, privacy-first** document processing platform. Convert, process, and enhance documents across 25+ formats — at scale, with high fidelity, and zero retention by default.

---

## 🎯 Product Vision

Deliver a platform where any user — student, developer, or enterprise professional — can upload any file and receive a perfectly formatted output in seconds, with no tracking or data retention.

---

## 👥 Target Users

| Persona | Primary Use Cases |
|---|---|
| 🎓 Students | PDF ↔ DOCX, handwritten notes OCR, thesis formatting |
| 💼 Office Professionals | Excel/Word/PPT workflows, batch conversion, watermarking |
| 👨‍💻 Developers | JSON/XML/CSV tools, HTML→PDF, API-driven automation |
| 📚 Creators | EPUB/MOBI eBook creation, image-to-doc pipelines |
| 🏢 SMBs | Bulk conversion, API integration, team quotas |

---

## ✨ Features

### 📄 Document Conversion Matrix (25+ Formats)

**Text & Markup**
- TXT ↔ PDF / DOCX / HTML / RTF / MD
- MD → HTML / PDF / DOCX
- RTF ↔ DOCX / PDF / TXT

**PDF (Advanced)**
- From PDF → DOCX, XLSX (tables), PPTX, TXT, HTML, JPG/PNG, EPUB
- To PDF → DOCX, XLSX, PPTX, HTML, Images

**Microsoft Office**
- DOC ↔ DOCX → PDF / HTML / EPUB / TXT
- XLS ↔ XLSX ↔ CSV → PDF
- PPT ↔ PPTX → PDF / Images

**eBooks**
- EPUB ↔ PDF / DOCX / TXT
- MOBI → EPUB / PDF

**Web & Data**
- HTML ↔ PDF / DOCX / TXT
- JSON ↔ CSV ↔ XML

**OCR (Scanned)**
- JPG / PNG / WEBP → TXT / DOCX / Searchable PDF
- Scanned PDF → Editable DOCX (layout-aware, v2)

---

### 🧰 Document Utilities

- ✅ Merge / Split PDF
- ✅ Compress PDF (Quick + Lossless modes)
- ✅ Rotate / Reorder pages
- ✅ Password protect / Unlock PDF
- ✅ Watermark text on all pages
- ✅ OCR text extraction → TXT or DOCX
- 🔜 Basic annotations (v2)

---

### 🤖 Intelligence Layer

- **Auto Format Detection** — MIME + content sniffing
- **Smart Suggestions** — best target format per use-case
- **Layout Recovery** — tables, columns, headers preserved
- **Multi-language OCR** — v2 with PaddleOCR fallback
- **Conversion Modes**: Quick (fast) vs Lossless (max fidelity)

---

### 📦 Batch Processing

- Upload multiple files simultaneously
- Set per-file output format
- Download all results as a single ZIP archive

---

### 🎨 UI/UX

- Premium SaaS design — Light/Dark mode
- Framer Motion micro-animations
- Drag & drop with Smart Analysis phase
- In-browser PDF/Image preview
- Session-persistent conversion history
- Settings panel: mode, privacy, notifications
- Fully responsive (PWA-ready)

---

## 🚀 Roadmap

### Phase 1 — MVP *(In Progress)*
- [x] Core conversions: PDF ↔ DOCX, TXT, XLSX
- [x] Batch upload + ZIP download
- [x] Basic OCR (image → text + DOCX)
- [x] Premium UI + dark/light mode
- [x] Session history + file preview
- [ ] Quick vs Lossless mode enforcement

### Phase 2 — Scale *(4–6 weeks)*
- [ ] eBook support: EPUB, MOBI, AZW
- [ ] HTML/Markdown conversions
- [ ] Smart format suggestions (AI)
- [ ] Cloud import/export (Drive, Dropbox)
- [ ] Advanced layout recovery + multi-language OCR

### Phase 3 — Enterprise *(v2)*
- [ ] Public REST API + API keys
- [ ] Async job queue (Redis + BullMQ)
- [ ] Offline WASM-based conversions
- [ ] Team workspace + quotas
- [ ] Enterprise SLA + on-prem option

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand (persist) |
| Backend | Supabase Edge Functions (Deno) |
| Storage | Supabase Storage (auto-expiry) |
| OCR | Tesseract (v2: PaddleOCR) |
| Workers (v2) | LibreOffice · Pandoc · Ghostscript · Sharp |
| Queue (v2) | Redis + BullMQ |

---

## ⚙️ Getting Started

```bash
# Clone the repository
git clone https://github.com/chetan3232/convertx-pro.git
cd convertx-pro

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY

# Start development server
npm run dev

# Format code
npm run format

# Run linter
npm run lint
```

---

## 🔐 Security & Privacy

- 🔒 TLS on all connections
- ⏳ Files auto-deleted after 1 hour (configurable)
- 🧠 No-store mode: memory-only processing
- 🔐 Encrypted storage at rest
- 🦠 Virus scanning via ClamAV (planned)
- 🚫 Rate limiting + abuse protection

---

## 📈 Performance Targets

| File Size | Target Time |
|---|---|
| < 5 MB | < 5 seconds |
| 5–50 MB | < 20 seconds |
| Success rate | ≥ 97% |
| Queue wait | < 2 seconds (p50) |

---

## 💰 Monetization

| Plan | Details |
|---|---|
| Free | Limited conversions/day, size caps |
| Pro | Unlimited, priority queue, no ads |
| API | Pay-per-use (per page/MB) |
| Enterprise (v2) | SLA, on-prem, custom quotas |

---

## 🤝 Contributing

Contributions are welcome! Fork the repository, make your changes, and submit a pull request.

---

## 📬 Contact

- 🌐 Website: [convertx-pro.lovable.app](https://convertx-pro.lovable.app)
- 📧 Email: gamerchetan323@gmail.com
- 🐙 GitHub: [@chetan3232](https://github.com/chetan3232)

---

## 🏁 License

This project is licensed under the **MIT License**.

---

*⚡ ConvertX Pro — Convert Anything, Anytime, Anywhere.*
