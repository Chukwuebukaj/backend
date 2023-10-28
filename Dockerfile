# FROM node:18-alpine
# WORKDIR /app
# COPY package*.json ./
# RUN yarn 
# COPY . .
# CMD ["sh", "-c", "yarn compile && yarn dev"]
# EXPOSE 3005

# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN yarn install

# Bundle your app source code inside the Docker image
COPY . .

# Expose the necessary ports for development (compilation and application)
EXPOSE 3000

# Define the command to run your application in watch mode
CMD ["yarn", "dev"]

# Optionally, you can provide a second CMD to start the development server
# CMD ["yarn", "dev"]
