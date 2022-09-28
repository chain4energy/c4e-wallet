FROM node:16.15.0 as build-stage
WORKDIR /webapp
COPY /webapp/package*.json ./
RUN npm install
COPY ./webapp .
RUN npm run build

FROM nginx as production-stage
COPY --from=build-stage /webapp/dist /usr/share/nginx/html
EXPOSE 80
#EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
