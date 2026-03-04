# Read-Only File Storage Server (TypeScript)

This project is a Dockerized file server for serving static files (such as images) via HTTP. It is strictly read-only: no file creation, update, or deletion is allowed.

## Features
- Serves files from a specified directory
- Read-only access (no upload, update, or delete)
- Designed for use as a backend file storage for other projects

## API
- Only GET requests are allowed
- No endpoints for file upload, update, or delete

### Build the Docker image
```
docker build -t lucidkarn/lucian-solutions-file-server:latest .
```

You can add files to the `/files/` directory on your host, and they will be served by the container.

## Batch convert images to WebP

If you want to convert all PNG / JPG / JPEG files under `./files` (including subfolders) to WebP, save the included script and run it with Node.

1. Install dependencies:

```bash
npm install sharp
# ffmpeg is required for GIF -> WebM conversion. Install via your package manager (apt/brew/choco) or see https://ffmpeg.org/
```

2. Save the script to `scripts/convert-to-webp.js` (already included in this repo).

3. Run it (default target is `./files`):

```bash
node scripts/convert-to-webp.js ./files
```

What the script does:
- Recursively finds `.png`, `.jpg`, `.jpeg`, and `.gif` files
 - For PNG/JPG/JPEG: skips conversion if `file.ext.webp` already exists; resizes so neither width nor height exceed 1024px (keeps aspect ratio, no upscaling), then writes `file.ext.webp` alongside the original with quality 80
 - For GIF: skips conversion if `file.gif.webm` already exists; converts to WebM using `ffmpeg` while scaling so the larger dimension is at most 1024px, and writes `file.gif.webm` (appends the original `.gif` extension)

You can pass a different directory as the first argument.
