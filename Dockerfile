FROM nginx:alpine

ARG BUILD_NUMBER

# Remove default content
RUN rm -rf /usr/share/nginx/html/*

# Copy project files
COPY . /usr/share/nginx/html

# Replace placeholder with build number (adjust path if index.html is nested)
RUN sed -i "s|__BUILD_NUMBER__|${BUILD_NUMBER}|g" /usr/share/nginx/html/index.html

EXPOSE 80
