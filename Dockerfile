FROM nginx:alpine

ARG BUILD_NUMBER

RUN rm -rf /usr/share/nginx/html/*

COPY final_Dev_project_1/ /usr/share/nginx/html/

RUN sed -i "s|__BUILD_NUMBER__|${BUILD_NUMBER}|g" /usr/share/nginx/html/index.html

RUN cat /usr/share/nginx/html/index.html


EXPOSE 80
