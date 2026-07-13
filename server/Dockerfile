FROM node:20-alpine

# Install Python and ffmpeg for yt-dlp
RUN apk add --no-cache python3 ffmpeg

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate prisma client
RUN npm install
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

EXPOSE 8000

CMD ["npm", "start"]
