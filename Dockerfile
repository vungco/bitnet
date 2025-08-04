#1 base image
FROM node:20-alpine

#2 tao thu muc
WORKDIR /app

#3 Copy file cài dependencies
COPY package*.json ./
RUN npm install

#4 Copy toàn bộ mã nguồn
COPY . .

#5 Build project
RUN npm run build

#6 Expose port 8003
EXPOSE 8003

#7 Command chạy app
CMD ["node", "dist/main"]