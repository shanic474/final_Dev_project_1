FROM node:18-alpine AS build

ARG APP_NAME

WORKDIR /app

COPY $APP_NAME/package*.json ./

RUN npm install

COPY $APP_NAME/ ./

RUN npm run build   # optional, for React/Angular

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
