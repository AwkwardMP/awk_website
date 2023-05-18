####################################################
### BUILDER ########################################
####################################################
FROM node:18-alpine as builder

WORKDIR /usr/src/app

ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

COPY ./client/package*.json /usr/src/app/
RUN npm install

COPY ./client /usr/src/app
RUN npm run build

####################################################
### CONTAINER ######################################
####################################################
FROM node:18-alpine 
WORKDIR /usr/src/app


ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

COPY ./server /usr/src/app/
RUN npm install

COPY --from=builder /usr/src/app/dist/ dist/

EXPOSE 3000
ENTRYPOINT ["npm", "run", "start"]