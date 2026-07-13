export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
      <h1 className="text-4xl font-bold mb-8 text-white">About Universal Video Downloader</h1>
      <div className="glass-card p-8 space-y-6 text-gray-300">
        <p>
          Universal Video Downloader is a premium, state-of-the-art web application designed to help you download 
          videos and audio from your favorite platforms seamlessly.
        </p>
        <p>
          Our mission is to provide a fast, secure, and user-friendly experience without the clutter and intrusive ads 
          found on most downloader websites. We utilize the latest web technologies including Next.js, Framer Motion, 
          and a robust Express backend powered by yt-dlp to deliver unmatched performance.
        </p>
        <h2 className="text-2xl font-bold text-white mt-8 mb-4">Core Values</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Quality:</strong> Best possible video and audio formats.</li>
          <li><strong>Design:</strong> A beautiful, distraction-free interface.</li>
          <li><strong>Privacy:</strong> We don&apos;t track your downloads or sell your data.</li>
          <li><strong>Compliance:</strong> We encourage users to respect copyright laws and terms of service.</li>
        </ul>
      </div>
    </div>
  );
}
