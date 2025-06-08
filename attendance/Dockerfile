FROM node:20

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build

# Создаём директорию для логов
RUN mkdir -p logs

CMD ["npm", "run", "start"]
