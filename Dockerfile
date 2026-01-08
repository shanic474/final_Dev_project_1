FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY  final_Dev_project_1/ /usr/share/nginx/html
COPY . /usr/share/nginx/html
EXPOSE 80
