FROM node:16.15.0 as build-stage
WORKDIR /webapp
COPY /webapp/package*.json ./
RUN npm install
COPY ./webapp .
RUN npm run build

FROM nginx as production-stage
RUN mkdir /app
COPY --from=build-stage /webapp/dist /app
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/certs /etc/nginx/certs
EXPOSE 80
#EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
