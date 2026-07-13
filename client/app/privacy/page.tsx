export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
      <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
      <div className="glass-card p-8 space-y-6 text-gray-300">
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-white mt-6">1. Information We Collect</h2>
        <p>
          We do not require you to create an account or provide personal information to use our core downloading features. 
          We temporarily log URLs processed through our system for functional and security purposes (e.g., rate limiting).
        </p>

        <h2 className="text-2xl font-bold text-white mt-6">2. Download History</h2>
        <p>
          Your download history might be stored anonymously in our database to provide community statistics (like popular formats). 
          We do not associate this data with your personal identity.
        </p>

        <h2 className="text-2xl font-bold text-white mt-6">3. Third-Party Services</h2>
        <p>
          We interact with third-party platforms (such as YouTube, Vimeo, etc.) solely to retrieve metadata and download links as requested by you. 
          Please review their respective privacy policies to understand how they handle data.
        </p>
      </div>
    </div>
  );
}
