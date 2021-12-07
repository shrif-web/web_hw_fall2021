FROM nginx:alpine
COPY index.html /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
ADD pic /usr/share/nginx/html/pic