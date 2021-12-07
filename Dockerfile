FROM nginx:alpine
COPY index.html /usr/share/nginx/html
COPY style.css /usr/share/nginx/html
ADD pic /usr/share/nginx/html/pic
ADD img /usr/share/nginx/html/img
COPY black_logo_200x200.png /usr/share/nginx/html
COPY blue_logo_200x200.png /usr/share/nginx/html
COPY BNazanin.TTF /usr/share/nginx/html
COPY multi_logo_200x200.png /usr/share/nginx/html
