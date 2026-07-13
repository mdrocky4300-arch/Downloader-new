export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
      <h1 className="text-4xl font-bold mb-8 text-white">Terms of Service</h1>
      <div className="glass-card p-8 space-y-6 text-gray-300">
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-white mt-6">1. Acceptance of Terms</h2>
        <p>
          By accessing and using Universal Video Downloader, you agree to be bound by these Terms of Service. 
          If you do not agree with any part of these terms, you must not use our service.
        </p>

        <h2 className="text-2xl font-bold text-white mt-6">2. Acceptable Use</h2>
        <p>
          You agree to use this service only for downloading content that you have the right to download. 
          You must not use the service to infringe upon copyrights, bypass DRM, or violate the terms of service of the source platforms.
        </p>

        <h2 className="text-2xl font-bold text-white mt-6">3. Disclaimer of Warranties</h2>
        <p>
          The service is provided "as is" and "as available" without any warranties of any kind. We do not guarantee 
          that the service will be uninterrupted, secure, or error-free.
        </p>
      </div>
    </div>
  );
}
