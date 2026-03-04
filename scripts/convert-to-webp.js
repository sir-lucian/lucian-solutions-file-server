#!/usr/bin/env node
// Recursively convert PNG/JPEG files to WebP, keeping original filename and saving .webp alongside.
// Usage: node scripts/convert-to-webp.js [path]
// Example: node scripts/convert-to-webp.js ./files

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const startDir = process.argv[2] || path.join(process.cwd(), "files");
const exts = [".png", ".jpg", ".jpeg"];
const gifExt = ".gif";
const { spawnSync } = require('child_process');
let ffmpegPath;
try {
    ffmpegPath = require('ffmpeg-static');
} catch (e) {
    ffmpegPath = 'ffmpeg';
}

async function walk(dir) {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await walk(full);
            continue;
        }
        const ext = path.extname(entry.name).toLowerCase();

        if (exts.includes(ext)) {
            const webpPath = full + ".webp";
            try {
                await fs.promises.access(webpPath, fs.constants.F_OK)
                    .then(() => { console.log('Skipping (webp exists):', webpPath); return; })
                    .catch(async () => {
                        console.log('Converting:', full, '->', webpPath);
                        // Resize so that neither width nor height exceed 1024px, keep aspect ratio, don't enlarge small images
                        await sharp(full)
                            .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
                            .webp({ quality: 80 })
                            .toFile(webpPath);
                    });
            } catch (err) {
                console.error('Error processing', full, err);
            }
            continue;
        }

        // Handle GIF -> WebM conversion (requires ffmpeg installed)
        if (ext === gifExt) {
            const outPath = full.replace(/\.gif$/i, '.webm');
            try {
                // Skip if output already exists
                await fs.promises.access(outPath, fs.constants.F_OK)
                    .then(() => { console.log('Skipping (webm exists):', outPath); return; })
                    .catch(async () => {
                        console.log('Converting GIF to WebM:', full, '->', outPath);
                        // Determine dimensions with sharp and set a simple scale filter so
                        // that the larger side is at most 1024 while preserving aspect ratio.
                        let vf;
                        try {
                            const meta = await sharp(full).metadata();
                            if (meta && meta.width && meta.height) {
                                if (meta.width > meta.height) {
                                    const tw = Math.min(1024, meta.width);
                                    vf = `scale=${tw}:-2`;
                                } else {
                                    const th = Math.min(1024, meta.height);
                                    vf = `scale=-2:${th}`;
                                }
                            } else {
                                vf = 'scale=1024:-2';
                            }
                        } catch (e) {
                            vf = 'scale=1024:-2';
                        }

                        const args = ['-y', '-i', full, '-vf', vf, '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-an', outPath];
                        const res = spawnSync(ffmpegPath, args, { stdio: 'inherit' });
                        if (res.error) throw res.error;
                        if (res.status !== 0) throw new Error('ffmpeg failed with status ' + res.status);
                    });
            } catch (err) {
                console.error('Error converting GIF', full, err);
            }
            continue;
        }
    }
}

(async () => {
    try {
        const stat = await fs.promises.stat(startDir);
        if (!stat.isDirectory())
            throw new Error("Path is not a directory: " + startDir);
    } catch (err) {
        console.error("Directory not found:", startDir);
        process.exit(1);
    }

    console.log("Starting conversion under", startDir);
    await walk(startDir);
    console.log("Done.");
})();
