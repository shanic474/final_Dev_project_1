FROM nginx:alpine

ARG APP_NAME

RUN rm -rf /usr/share/nginx/html/*

COPY $APP_NAME /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
