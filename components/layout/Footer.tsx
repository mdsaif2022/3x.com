export default function Footer() {
  return (
    <footer className="bg-dark-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">VideoStream Pro</h3>
            <p className="text-gray-400">
              Premium video streaming platform with integrated monetization features.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-400 hover:text-primary-orange transition-colors">Home</a></li>
              <li><a href="/categories" className="text-gray-400 hover:text-primary-orange transition-colors">Categories</a></li>
              <li><a href="/trending" className="text-gray-400 hover:text-primary-orange transition-colors">Trending</a></li>
              <li><a href="/admin" className="text-gray-400 hover:text-primary-orange transition-colors">Admin</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
            <p className="text-gray-400">Email: support@videostreampro.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 VideoStream Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
