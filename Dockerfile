# Client
FROM node:12-alpine AS client

# Install build deps
RUN apk add python3 make g++

# Build client
WORKDIR /client
COPY client/package*.json ./
RUN npm set progress=false && npm ci --no-cache
COPY client/. .
RUN npm run build

# Server
FROM node:12-alpine AS server

# Run server
COPY --from=client /client/build /client/build/.
WORKDIR /server

COPY server/package*.json ./
RUN npm set progress=false && npm ci --no-cache
COPY server/. .

FROM server as test
RUN npm run test

FROM server as runtime
EXPOSE 80
CMD [ "npm", "run", "start" ]
