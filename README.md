# Secure Image to PDF Converter

A production-ready, privacy-first Image → PDF converter. Upload JPG/PNG/WEBP images,
reorder and rotate them, and download a single PDF — no account required, and every
uploaded file is deleted automatically within minutes.

## Tech stack

**Frontend:** React + Vite + TypeScript + Tailwind CSS + React Router + Axios + React Dropzone + Framer Motion
**Backend:** Node.js + Express + TypeScript + Multer + Sharp + pdf-lib + Helmet + express-rate-limit

## Project structure

```
image-to-pdf/
├── client/            # React frontend (deploy to Vercel)
│   └── src/
│       ├── components/  # Header, Footer, Dropzone, ImageList, ConvertPanel, etc.
│       ├── pages/        # Home, Features, HowItWorks, FAQ, About, Contact, Privacy, Terms, 404
│       ├── hooks/        # useDarkMode, useImageUpload
│       ├── services/     # api.ts (Axios client)
│       └── types/
└── server/            # Express backend (deploy to Render)
    └── src/
        ├── routes/        # upload, convert, download/cleanup
        ├── controllers/
        ├── middleware/    # upload (multer), rate limiting, error handling
        ├── services/      # imageService, pdfService, sessionStore, downloadStore, cleanupService
        ├── utils/         # validators, fileUtils
        └── config/        # env.ts
```

## Local development

### 1. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

The API runs on `http://localhost:5000` by default. Health check: `GET /health`.

### 2. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The app runs on `http://localhost:5173` and talks to the backend via `VITE_API_URL`.

## API reference

| Method | Route             | Description                                              |
|--------|--------------------|------------------------------------------------------------|
| POST   | `/api/upload`      | Multipart upload of one or more images. Returns `sessionId` + image metadata with preview thumbnails. |
| POST   | `/api/convert`     | Builds a PDF from a session's images in a given order/rotation/page settings. Returns a `downloadId`. |
| GET    | `/api/download/:id`| Streams the generated PDF, then deletes it (single-use).  |
| DELETE | `/api/cleanup`     | Manually deletes an in-progress session (`{ sessionId }`). |

## Security measures implemented

- Helmet security headers (CSP, no `X-Powered-By`, etc.)
- CORS locked to the configured frontend origin(s)
- express-rate-limit on all routes, with a stricter limit on upload/convert
- MIME type **and** extension allow-listing (jpg/jpeg/png/webp only)
- Files are re-encoded through Sharp before being persisted — this strips EXIF metadata and rejects files that merely spoof their extension
- Per-file (20MB) and total (100MB) upload size limits enforced both client- and server-side
- Random UUID filenames — the original filename is never used on disk
- Path traversal protection (`safeResolvePath`) for any path built from user input
- Files are deleted immediately after download, and a background sweep purges anything left over after 5 minutes
- No server file paths are ever exposed to the client — only opaque IDs

## Deployment guide

### Step 1 — Push to GitHub

```bash
cd image-to-pdf
git init
git add .
git commit -m "Initial commit: Secure Image to PDF Converter"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### Step 2 — Deploy the backend to Render

1. Go to [render.com](https://render.com) → **New → Web Service**.
2. Connect your GitHub repo.
3. Set **Root Directory** to `server`.
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add the environment variables from `server/.env.example` (Render's free plan is sufficient).
7. Deploy, then copy the resulting URL (e.g. `https://image-to-pdf-server.onrender.com`).

### Step 3 — Deploy the frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import the same repo.
2. Set **Root Directory** to `client`.
3. Framework preset: Vite.
4. Add environment variable `VITE_API_URL` = `https://<your-render-url>/api`.
5. Deploy, then copy the resulting URL (e.g. `https://image-to-pdf.vercel.app`).

### Step 4 — Connect the two

Go back to your Render service → Environment → set `CLIENT_ORIGIN` to your Vercel URL
(e.g. `https://image-to-pdf.vercel.app`) and redeploy the backend so CORS allows it.

### Step 5 — Verify

- Visit your Vercel URL, confirm HTTPS is active (both Vercel and Render provide free SSL automatically).
- Upload a few images, reorder/rotate, convert, and download the PDF.
- Check `GET https://<render-url>/health` returns `{ "status": "ok" }`.

## Testing checklist

- [ ] Upload a single image
- [ ] Upload multiple images (10+)
- [ ] Upload an oversized image (>20MB) — should be rejected with a friendly message
- [ ] Upload a non-image file renamed to `.jpg` — should be rejected (content sniffing via Sharp)
- [ ] Reorder images via drag-and-drop
- [ ] Rotate an image and confirm it appears rotated in the output PDF
- [ ] Convert with each page size (A4/Letter) and orientation (portrait/landscape)
- [ ] Download the PDF and confirm the link is single-use
- [ ] Test on mobile viewport widths (375px+) and tablet (768px+)
- [ ] Toggle dark mode and confirm it persists on reload
- [ ] Confirm rate limiting kicks in after rapid repeated requests

## Notes on scaling further

- Session/download state is currently in-memory (`Map`), which is fine for a single free-tier
  instance but won't survive a restart or scale across multiple instances. Swap in Redis with a
  TTL matching `FILE_RETENTION_MINUTES` if you need horizontal scaling.
- Consider adding a CDN in front of the frontend (Vercel provides this by default) and enabling
  Render's autoscaling on a paid plan for higher traffic.
