FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

ARG target

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/admin /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
