import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaUpload, FaTrash, FaPlus, FaMapMarkerAlt, FaTag, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { itemsAPI } from '../services/api';

const CreateItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Furniture',
    'Toys',
    'Sports',
    'Kitchen',
    'Other'
  ];

  const conditions = [
    'New',
    'Like New',
    'Good',
    'Fair',
    'Used'
  ];

  const pickupOptions = [
    'I can deliver',
    'Pickup only',
    'Flexible - can arrange pickup or drop-off'
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        toast.error(`${file.name} is not a valid image type`);
      }
      if (!isValidSize) {
        toast.error(`${file.name} is too large (max 5MB)`);
      }
      
      return isValidType && isValidSize;
    });

    if (images.length + validFiles.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    const newImages = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file)
    }));

    setImages([...images, ...newImages]);
  };

  const removeImage = (imageId) => {
    setImages(images.filter(img => img.id !== imageId));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

    const onSubmit = async (data) => {
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare item data
      const itemData = {
        title: data.title,
        description: data.description,
        category: data.category.toLowerCase(),
        condition: data.condition.toLowerCase(),
        location: data.location,
        pickupPreferences: data.pickupPreferences,
        dimensions: data.dimensions,
        tags: tags
      };

      // Create item via API
      await itemsAPI.create(itemData);

      toast.success('Item created successfully! It will be visible to the community soon.');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error(error.response?.data?.message || 'Failed to create item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Donate an Item</h1>
          <p className="text-gray-600">
            Share your unused items with someone who needs them. Your generosity makes a difference!
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Title *
                </label>
                <input
                  {...register('title', { 
                    required: 'Title is required',
                    minLength: { value: 3, message: 'Title must be at least 3 characters' }
                  })}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Children's Books Collection"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition *
                </label>
                <select
                  {...register('condition', { required: 'Condition is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select condition</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
                {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    {...register('location', { required: 'Location is required' })}
                    type="text"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., New York, NY"
                  />
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 20, message: 'Description must be at least 20 characters' }
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your item in detail. Include size, color, any defects, and why someone might want it..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Images</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Images * (Max 5 images, 5MB each)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FaUpload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200"
                >
                  Choose Images
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  JPEG, PNG, or GIF up to 5MB each
                </p>
              </div>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.preview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <FaTrash className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (Optional)
                </label>
                <input
                  {...register('dimensions')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 24 x 18 x 12 inches"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pickup Preferences *
                </label>
                <select
                  {...register('pickupPreferences', { required: 'Pickup preference is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select preference</option>
                  {pickupOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.pickupPreferences && <p className="text-red-500 text-sm mt-1">{errors.pickupPreferences.message}</p>}
              </div>
            </div>

            {/* Tags */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-green-600 text-white rounded-r-md hover:bg-green-700"
                >
                  <FaPlus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Add up to 5 tags to help people find your item
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? 'Creating...' : 'Create Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem; 