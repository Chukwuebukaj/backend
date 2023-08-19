FROM node:18-alpine
WORKDIR /app
COPY . .
RUN yarn 
CMD ["sh", "-c", "yarn compile && yarn dev"]
EXPOSE 3005