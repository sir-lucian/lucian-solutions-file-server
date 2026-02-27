FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY tsconfig.json .
COPY src ./src
COPY files ./files
RUN mkdir -p files

RUN npm install && npm run build

EXPOSE 80

CMD ["npm", "start"]
