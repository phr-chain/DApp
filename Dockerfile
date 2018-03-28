# FROM node:8 as build
# COPY . .
# RUN npm install
# RUN npm run build

# FROM node:8 as release
# COPY --from=build /build ./build
# RUN npm install -g serve
# EXPOSE 5000
# CMD [ "serve", "-s", "build" ]


FROM node:8 as build
COPY . .
RUN npm install
RUN npm run start
EXPOSE 3000
CMD [ "npm", "run", "start" ]
