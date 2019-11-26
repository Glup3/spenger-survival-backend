FROM node:11

RUN mkdir /app

WORKDIR /app

COPY . ./

RUN npm install

RUN npm install pm2 -g

RUN pm2 install typescript

# RUN npm run build

# WORKDIR /app/dist

EXPOSE 4000

CMD ["pm2-runtime", "src/index.ts"]