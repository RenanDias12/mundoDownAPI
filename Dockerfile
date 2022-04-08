FROM node:alpine
WORKDIR /app
COPY . .
ENV PORT=${PORT}
ENV SALT_WORK_FACTORY=${SALT_WORK_FACTORY}
RUN npm install
EXPOSE ${PORT}
ENTRYPOINT ["node", "-r", "esm", "./src/server.js"]