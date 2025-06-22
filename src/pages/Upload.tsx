import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { memoryService } from '../services/api';

interface FileWithPreview extends File {
  preview?: string;
}

const Upload: React.FC = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    dateTaken: '',
    location: '',
    tags: '',
    collection: '',
    privacy: 'private'
  });
  const [warning, setWarning] = useState<string>('');
  const [suggestedTags] = useState(['Family', 'Vacation', 'Birthday', 'Travel', 'Celebration']);
  const [availableCollections, setAvailableCollections] = useState<string[]>([]);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!metadata.title.trim()) {
      setError('Please enter a title for your memory');
      return false;
    }

    if (!metadata.description.trim()) {
      setError('Please enter a description for your memory');
      return false;
    }

    if (!metadata.dateTaken) {
      setError('Please select a date for your memory');
      return false;
    }

    if (files.length === 0) {
      setError('Please select an image to upload');
      return false;
    }

    return true;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 1) {
        setWarning('Only one image can be uploaded at a time. Please select a single image.');
        return;
      }
      setWarning('');
      const file = acceptedFiles[0];
      if (file) {
        setFiles([Object.assign(file, {
          preview: URL.createObjectURL(file)
        })]);
      }
    },
    onDropRejected: (rejectedFiles) => {
      if (rejectedFiles.length > 1) {
        setWarning('Only one image can be uploaded at a time. Please select a single image.');
      }
    }
  });

  const removeFile = () => {
    setFiles([]);
  };

  const handleMetadataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMetadata(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = async () => {
    if (!validateForm()) {
      return;
    }

    if (files.length === 0) {
      setError('Please select an image to upload');
      return;
    }

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append('file', file);

      // Get the token from localStorage
      const token = localStorage.getItem('memoirbox_token');
      if (!token) {
        setError('Please log in to upload images');
        setIsUploading(false);
        return;
      }

      console.log('Uploading file:', file.name);
      const uploadRes = await memoryService.uploadMemory(formData);

      if (uploadRes.imageUrl) {
        console.log('File uploaded successfully:', uploadRes.imageUrl);
        
        // Create memory with the uploaded image
        const memoryData = {
          title: metadata.title,
          description: metadata.description,
          imageUrls: [uploadRes.imageUrl],
          date: metadata.dateTaken,
          location: metadata.location || '',
          tags: metadata.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          visibility: metadata.privacy as 'private' | 'family' | 'public'
        };

        console.log('Creating memory with data:', memoryData);
        await memoryService.createMemory(memoryData);

        setShowSuccessModal(true);
        // Clear form and files after successful upload
        setFiles([]);
        setMetadata({
          title: '',
          description: '',
          dateTaken: '',
          location: '',
          tags: '',
          collection: '',
          privacy: 'private'
        });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      const errorMessage = err.response?.data?.message || err.message;
      setError(`Failed to upload: ${errorMessage}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUploadMore = () => {
    setShowSuccessModal(false);
    setFiles([]);
    setMetadata({
      title: '',
      description: '',
      dateTaken: '',
      location: '',
      tags: '',
      collection: '',
      privacy: 'private'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-text-primary mb-2">Upload Memory</h2>
        <p className="text-text-secondary">Add a photo to preserve your precious moment</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {warning && (
        <div className="mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
          {warning}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area - Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag and Drop Zone */}
          <div className="card p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed border-secondary-300 rounded-large p-12 text-center hover:border-accent transition-fast cursor-pointer bg-gray-50/50
                ${isDragActive ? 'border-accent bg-accent/5' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center space-y-4">
                <svg className="w-16 h-16 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-2">
                    {isDragActive ? "Drop your image here" : "Drag & drop your image here"}
                  </h3>
                  <p className="text-text-secondary mb-4">or tap to select an image from your device</p>
                  <p className="text-sm text-text-secondary">Supported formats: JPG, PNG, GIF</p>
                  <p className="text-sm text-text-secondary mt-2">Note: Only one image can be uploaded at a time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Selected File Preview */}
          {files.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-medium text-text-primary mb-4">Selected Image</h3>
              <div className="relative bg-gray-50 rounded-lg p-3 border border-light">
                <div className="aspect-square bg-gray-200 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={files[0].preview}
                    alt={files[0].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs font-medium text-text-primary truncate">{files[0].name}</p>
                <p className="text-xs text-text-secondary">{(files[0].size / 1024 / 1024).toFixed(2)} MB</p>
                <button
                  onClick={removeFile}
                  className="absolute top-1 right-1 w-6 h-6 bg-error text-white rounded-full flex items-center justify-center text-xs hover:bg-error-600 transition-fast"
                >
                  ×
                </button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-text-primary">Uploading...</span>
                    <span className="text-sm text-text-secondary">{Math.round(uploadProgress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Upload Button */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className={`btn btn-accent ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isUploading ? 'Uploading...' : 'Upload Memory'}
                </button>
                <button
                  onClick={removeFile}
                  className="btn btn-secondary"
                  disabled={isUploading}
                >
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Metadata Form - Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="text-lg font-medium text-text-primary mb-6">Memory Details</h3>
            
            <form className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-text-primary mb-2">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={metadata.title}
                  onChange={handleMetadataChange}
                  className="input w-full"
                  placeholder="Enter memory title"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-2">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={metadata.description}
                  onChange={handleMetadataChange}
                  rows={3}
                  className="input w-full resize-none"
                  placeholder="Describe this memory..."
                />
              </div>

              {/* Date Taken */}
              <div>
                <label htmlFor="dateTaken" className="block text-sm font-medium text-text-primary mb-2">Date Taken</label>
                <input
                  type="date"
                  id="dateTaken"
                  name="dateTaken"
                  value={metadata.dateTaken}
                  onChange={handleMetadataChange}
                  className="input w-full"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={metadata.location}
                    onChange={handleMetadataChange}
                    className="input w-full pl-10"
                    placeholder="Enter location"
                  />
                  <svg className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-text-primary mb-2">Tags</label>
                <div className="relative">
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={metadata.tags}
                    onChange={handleMetadataChange}
                    className="input w-full pl-10"
                    placeholder="Add tags (comma separated)"
                  />
                  <svg className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const currentTags = metadata.tags.split(',').map(t => t.trim()).filter(t => t);
                        if (!currentTags.includes(tag)) {
                          const newTags = [...currentTags, tag].join(', ');
                          setMetadata(prev => ({ ...prev, tags: newTags }));
                        }
                      }}
                      className="px-2 py-1 text-xs bg-secondary-100 text-text-secondary rounded-full hover:bg-secondary-200 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collection */}
              <div>
                <label htmlFor="collection" className="block text-sm font-medium text-text-primary mb-2">Collection</label>
                <select
                  id="collection"
                  name="collection"
                  value={metadata.collection}
                  onChange={handleMetadataChange}
                  className="input w-full"
                >
                  <option value="">Select a collection</option>
                  {availableCollections.map((collection) => (
                    <option key={collection} value={collection}>
                      {collection}
                    </option>
                  ))}
                </select>
              </div>

              {/* Privacy Settings */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Privacy Settings</label>
                <div className="space-y-3">
                  {[
                    { value: 'private', label: 'Private', description: 'Only you can see this' },
                    { value: 'family', label: 'Family', description: 'Share with family members' },
                    { value: 'public', label: 'Public', description: 'Anyone can view this' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="privacy"
                        value={option.value}
                        checked={metadata.privacy === option.value}
                        onChange={handleMetadataChange}
                        className="text-accent focus:ring-accent"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-text-primary">{option.label}</div>
                        <div className="text-xs text-text-secondary">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-light">
                <button
                  type="button"
                  onClick={() => setMetadata({
                    title: '',
                    description: '',
                    dateTaken: '',
                    location: '',
                    tags: '',
                    collection: '',
                    privacy: 'private'
                  })}
                  className="btn btn-secondary w-full"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-large p-6 max-w-md mx-4 shadow-large">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">Upload Successful!</h3>
              <p className="text-text-secondary mb-6">Your memories have been uploaded and saved to your collection.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleUploadMore}
                  className="btn btn-secondary flex-1"
                >
                  Upload More
                </button>
                <button
                  onClick={() => navigate('/gallery')}
                  className="btn btn-accent flex-1"
                >
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload; 