FROM node:16.15.0 as build-stage
RUN apt update && apt install tzdata -y
ENV TZ="Europe/Warsaw"
WORKDIR /webapp
COPY ../../webapp/package*.json ./
RUN npm install
COPY ../../webapp .
RUN npm run build

FROM nginx as production-stage
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /webapp/dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
