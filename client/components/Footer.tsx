import Link from "next/link";
import { CloudDownload } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 glass mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 text-primary">
              <CloudDownload className="w-8 h-8" />
              <span className="font-bold text-xl text-white">Universal DL</span>
            </Link>
            <p className="text-gray-400 text-sm max-w-sm">
              The ultimate, modern solution for downloading videos from the web.
              Respect copyright and terms of service. Do not use for pirated content.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Github</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/api-docs" className="hover:text-primary transition-colors">API Docs</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Universal Video Downloader. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
