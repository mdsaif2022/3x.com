'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Download, Eye, Clock, Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-dark-200 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-orange to-primary-skyblue rounded-lg flex items-center justify-center">
              <Play className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VideoStream Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-300 hover:text-primary-orange transition-colors">
              Home
            </Link>
            <Link href="/categories" className="text-gray-300 hover:text-primary-orange transition-colors">
              Categories
            </Link>
            <Link href="/trending" className="text-gray-300 hover:text-primary-orange transition-colors">
              Trending
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-primary-orange"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-300 hover:text-primary-orange transition-colors">
                Home
              </Link>
              <Link href="/categories" className="text-gray-300 hover:text-primary-orange transition-colors">
                Categories
              </Link>
              <Link href="/trending" className="text-gray-300 hover:text-primary-orange transition-colors">
                Trending
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
