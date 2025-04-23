FROM node:22.14.0

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 7452

CMD ["pnpm", "start"]
