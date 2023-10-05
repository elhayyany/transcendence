
FROM node:latest

EXPOSE 3000

RUN mkdir -p /app
WORKDIR /app

COPY package*.json ./

RUN npm install

# COPY . .

RUN echo "sleep 10 && npx prisma migrate dev --name init && npm run start:dev" > init.sh
# RUN echo "npm run start:dev" > start.sh
RUN chmod +x init.sh
# RUN npm run start:dev 
CMD ["./init.sh"]
# RUN echo "THE SERVER CONTAINER IS RUNNING" 