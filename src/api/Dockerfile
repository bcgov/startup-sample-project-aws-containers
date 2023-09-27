FROM node:18-alpine

WORKDIR /app

COPY ./ ./
RUN npm set progress=false && npm ci --no-cache

EXPOSE 5000
CMD [ "node", "./bin/www" ]