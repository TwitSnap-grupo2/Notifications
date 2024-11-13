FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . .

ENV NODE_ENV=production

EXPOSE 8000

CMD ["npm", "run", "start"]
