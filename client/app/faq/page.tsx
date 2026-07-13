export default function FAQPage() {
  const faqs = [
    {
      q: "Is it free to use?",
      a: "Yes, Universal Video Downloader is completely free to use without any hidden charges."
    },
    {
      q: "What formats are supported?",
      a: "We support a wide range of formats including MP4, WebM for video, and MP3, M4A for audio in various qualities up to 4K depending on the source."
    },
    {
      q: "Which websites are supported?",
      a: "Our tool supports hundreds of popular websites including YouTube, Vimeo, Dailymotion, Facebook, Twitter, and more."
    },
    {
      q: "Do you save the downloaded videos on your servers?",
      a: "No, videos are streamed directly to your device and are not permanently stored on our servers."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl flex-grow">
      <h1 className="text-4xl font-bold mb-8 text-white">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-2">{faq.q}</h3>
            <p className="text-gray-400">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
