# Universal Video Downloader

An ultra-modern, production-ready Full Stack Video Downloader web application.

> **Disclaimer:** This project must not bypass DRM, authentication, paywalls, or platform security. It should only support downloading content when permitted by the platform, the content owner, and applicable laws. Use yt-dlp or other legal open-source tools where appropriate.

## Tech Stack
- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, TypeScript, yt-dlp
- **Database:** Prisma ORM, SQLite
- **Deployment:** Docker, Docker Compose, Nginx

## Prerequisites
- Node.js (v18+)
- Python 3 (for yt-dlp)
- ffmpeg (for video/audio processing)
- Docker (optional, for containerized deployment)

## Installation Guide (Local Development)

### 1. Clone the repository
```bash
git clone <repository_url>
cd Downloader
```

### 2. Setup Server (Backend)
```bash
cd server
npm install
npm run dev
```
*Note: Make sure `yt-dlp` and `ffmpeg` are installed on your host system if running locally.*

### 3. Setup Client (Frontend)
```bash
cd client
npm install
npm run dev
```

### 4. Access the App
Open your browser and navigate to `http://localhost:3000`.

## Docker Deployment
To run the full stack using Docker:
```bash
docker-compose up --build -d
```
Access the application on `http://localhost:80` (or `http://localhost:3000` for direct client access).

## Features
- **Modern UI:** Glassmorphism, smooth animations, dark/light themes.
- **Video Analysis:** Retrieves title, thumbnail, duration, and available formats.
- **Multiple Formats:** Downloads in various resolutions (144p to 1080p, Best) and Audio (MP3/M4A).
- **Progress Tracking:** Live percentage, estimated time, size, and speed.
- **History & Admin:** Download history with SQLite and an admin dashboard overview.
