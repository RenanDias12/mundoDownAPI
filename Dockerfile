FROM node:alpine
WORKDIR /app
COPY . .
ENV PORT=${PORT}
RUN npm install
EXPOSE ${PORT}
ENTRYPOINT ["node", "-r", "esm", "./src/server.js"]