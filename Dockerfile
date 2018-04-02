# FROM node:8 as build
# COPY . .
# RUN npm install
# RUN npm run build

# FROM node:8 as release
# COPY --from=build /build ./build
# RUN npm install -g serve
# EXPOSE 5000
# CMD [ "serve", "-s", "build" ]


# FROM node:8 as build
# COPY . .
# RUN npm install
# RUN npm run start
# EXPOSE 3000
# CMD [ "npm", "run", "start" ]

FROM node:8.11-alpine
ENV NODE_ENV production
WORKDIR /usr/src/app

RUN apk add -U openssl
RUN apk add -U git

COPY ["./package.json", "./package-lock.json*", "./npm-shrinkwrap.json*", "./"]
RUN npm install
COPY . .
RUN ls /usr/src/app
EXPOSE 3000
CMD npm run start
