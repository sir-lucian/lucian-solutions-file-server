# Read-Only File Storage Server (TypeScript)

This project is a Dockerized file server for serving static files (such as images) via HTTP. It is strictly read-only: no file creation, update, or deletion is allowed.

## Features
- Serves files from a specified directory
- Read-only access (no upload, update, or delete)
- Designed for use as a backend file storage for other projects

## API
- Only GET requests are allowed
- No endpoints for file upload, update, or delete
## Running with Docker

### 1. Build the Docker image
```
docker build -t lucidkarn/lucian-solutions-file-server:latest .
```

### 2. Run the container
```
docker run -d -p 3000:80 -v $(pwd)/files:/usr/src/app/files lucidkarn/lucian-solutions-file-server:latest
```

### 3. Access files
Open your browser or use HTTP requests to access files:
```
http://localhost:3000/files/yourfile.jpg
```

You can add files to the `files/` directory on your host, and they will be served by the container.
