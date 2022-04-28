# Use base node 12-slim image from Docker hub
FROM node:17.4.0-slim

WORKDIR /backend

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy rest of the application csource code
COPY . .

# Run app.js
ENTRYPOINT ["npx", "ts-node", "app.ts"]
