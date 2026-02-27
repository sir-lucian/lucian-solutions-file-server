FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static files into the image
COPY files /usr/share/nginx/html/files

EXPOSE 80
