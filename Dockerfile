FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

CMD [ "node", "server.js" ]

EXPOSE 3000
