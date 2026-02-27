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
