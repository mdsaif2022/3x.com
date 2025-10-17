'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Video } from '@/types/database';
import { addVideo, updateVideoById } from '@/lib/api';
import toast from 'react-hot-toast';

interface VideoFormProps {
  video?: Video | null;
  onClose: () => void;
  onSave: () => void;
}

export default function VideoForm({ video, onClose, onSave }: VideoFormProps) {
  const [formData, setFormData] = useState({
    title: video?.title || '',
    description: video?.description || '',
    category: video?.category || '',
    videoUrl: video?.videoUrl || '',
    thumbnailUrl: video?.thumbnailUrl || '',
    duration: video?.duration || '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (video) {
        // Update existing video
        const success = await updateVideoById(video.id, formData);
        if (success) {
          toast.success('Video updated successfully!');
          onSave();
        } else {
          toast.error('Failed to update video');
        }
      } else {
        // Add new video
        const videoData = {
          ...formData,
          views: 0,
          downloads: 0,
        };
        const newVideo = await addVideo(videoData);
        toast.success('Video added successfully!');
        onSave();
      }
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Error saving video');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-dark-200 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {video ? 'Edit Video' : 'Add New Video'}
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
              required
              rows={3}
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Education">Education</option>
              <option value="Gaming">Gaming</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Technology">Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Video URL</label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnailUrl"
              value={formData.thumbnailUrl}
              onChange={handleChange}
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Duration</label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 5:30"
              required
              className="w-full bg-dark-300 text-white rounded-lg px-4 py-2 border border-gray-600 focus:border-primary-orange focus:outline-none"
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : (video ? 'Update Video' : 'Add Video')}
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
