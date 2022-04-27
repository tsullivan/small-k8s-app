# Use base node 12-slim image from Docker hub
FROM node:17-slim

WORKDIR /frontend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the application csource code
COPY . .

# Compile the bundle
RUN npm run build

# Run app.js
ENTRYPOINT ["npx", "ts-node", "app.ts"]
