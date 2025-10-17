'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { AdsterraAd } from '@/types/database';

interface AdFormProps {
  ad?: AdsterraAd | null;
  onClose: () => void;
  onSave: () => void;
}

export default function AdForm({ ad, onClose, onSave }: AdFormProps) {
  const [formData, setFormData] = useState({
    type: ad?.type || 'banner',
    title: ad?.title || '',
    description: ad?.description || '',
    url: ad?.url || '',
    imageUrl: ad?.imageUrl || '',
    isActive: ad?.isActive ?? true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Implement save ad API call
      console.log('Saving ad:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave();
    } catch (error) {
      console.error('Error saving ad:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-200 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {ad ? 'Edit Ad' : 'Add New Ad'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white font-semibold mb-2">Ad Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            >
              <option value="banner">Banner Ad</option>
              <option value="native">Native Ad</option>
              <option value="smart_direct_link">Smart Direct Link</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Ad URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Image URL (Optional)</label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-4 h-4 text-primary-orange bg-dark-300 border-gray-600 rounded focus:ring-primary-orange focus:ring-2"
            />
            <label className="text-white font-semibold">Active</label>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (ad ? 'Update Ad' : 'Add Ad')}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
