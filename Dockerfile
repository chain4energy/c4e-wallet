FROM node:20.10.0 as build-stage
WORKDIR /webapp
COPY /webapp/package*.json ./
RUN npm install
COPY ./webapp .
RUN npm run build

FROM nginx as production-stage
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /webapp/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
