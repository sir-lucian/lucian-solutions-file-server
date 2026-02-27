FROM node:20-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

EXPOSE 80

RUN ls -l /usr/src/app && ls -l /usr/src/app/dist

CMD ["npm", "start"]
