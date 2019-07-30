FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY nginx.conf /etc/nginx/nginx.conf

ARG app
COPY dist/${app} /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]