import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CreateCollectionPopup from '../components/CreateCollectionPopup';
import CollectionViewPopup from '../components/CollectionViewPopup';
import { collectionService } from '../services/api';

const sampleCollections = [
  {
    id: 'family',
    name: 'Family Moments',
    description: 'Precious memories with loved ones and family gatherings',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    memoryCount: 24,
    lastUpdated: 'Updated 2 days ago',
    privacy: 'private',
  },
  {
    id: 'travel',
    name: 'Travel Adventures',
    description: 'Exploring the world and discovering new places',
    imageUrl: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    memoryCount: 18,
    lastUpdated: 'Updated 1 week ago',
    privacy: 'shared',
  },
  {
    id: 'celebrations',
    name: 'Celebrations',
    description: 'Special occasions and milestone moments',
    imageUrl: 'https://images.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg',
    memoryCount: 12,
    lastUpdated: 'Updated 3 days ago',
    privacy: 'private',
  },
  {
    id: 'work',
    name: 'Work & Career',
    description: 'Professional milestones and team memories',
    imageUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    memoryCount: 8,
    lastUpdated: 'Updated 5 days ago',
    privacy: 'shared',
  },
  {
    id: 'hobbies',
    name: 'Hobbies & Interests',
    description: 'Creative pursuits and personal passions',
    imageUrl: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    memoryCount: 15,
    lastUpdated: 'Updated 1 day ago',
    privacy: 'private',
  },
];

const privacyIcon = (privacy: string) =>
  privacy === 'private' ? (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
    </svg>
  ) : (
    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
    </svg>
  );

const Collections: React.FC = () => {
  const [sortBy, setSortBy] = useState('name');
  const [search, setSearch] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewPopupOpen, setIsViewPopupOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);
  const [userCollections, setUserCollections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const collections = await collectionService.getCollections();
      setUserCollections(collections);
    } catch (err) {
      setError('Failed to load collections');
      console.error('Error loading collections:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByDate = (collections: any[]) => {
    if (dateFilter === 'all') return collections;
    const now = new Date();
    let compareDate = new Date();
    if (dateFilter === '7days') compareDate.setDate(now.getDate() - 7);
    if (dateFilter === '30days') compareDate.setDate(now.getDate() - 30);
    if (dateFilter === 'year') compareDate.setFullYear(now.getFullYear() - 1);
    return collections.filter(col => {
      if (!col.createdAt) return true;
      const created = new Date(col.createdAt);
      if (dateFilter === '7days' || dateFilter === '30days') return created >= compareDate;
      if (dateFilter === 'year') return created >= compareDate;
      return true;
    });
  };

  const sortCollections = (collections: any[]) => {
    return [...collections].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'created') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      } else if (sortBy === 'modified') {
        return new Date(b.updatedAt || b.lastUpdated || 0).getTime() - new Date(a.updatedAt || a.lastUpdated || 0).getTime();
      } else if (sortBy === 'count') {
        return (b.memoryCount || (b.images?.length ?? 0)) - (a.memoryCount || (a.images?.length ?? 0));
      }
      return 0;
    });
  };

  const filteredDemoCollections = sortCollections(
    sampleCollections.filter(
      (col) =>
        col.name.toLowerCase().includes(search.toLowerCase()) ||
        col.description.toLowerCase().includes(search.toLowerCase())
    )
  );

  const filteredUserCollections = sortCollections(
    filterByDate(
      userCollections.filter(
        (col) =>
          col.name.toLowerCase().includes(search.toLowerCase()) ||
          col.description.toLowerCase().includes(search.toLowerCase())
      )
    )
  );

  const handleCreateCollection = async (collectionData: {
    name: string;
    description: string;
    privacy: string;
    selectedImages: string[];
  }) => {
    try {
      const newCollection = await collectionService.createCollection({
        name: collectionData.name,
        description: collectionData.description,
        privacy: collectionData.privacy,
        images: collectionData.selectedImages
      });
      
      setUserCollections(prev => [...prev, newCollection]);
    } catch (err) {
      console.error('Error creating collection:', err);
      // You might want to show an error message to the user here
    }
  };

  const handleCollectionClick = (collection: any) => {
    // Only open popup for user collections, not demo collections
    if (!collection.isDemo) {
      setSelectedCollection(collection);
      setIsViewPopupOpen(true);
    }
  };

  const renderCollectionCard = (col: any, isDemo: boolean = false) => (
    <div 
      key={col.id || col._id} 
      className={`card hover:shadow-medium transition-fast ${isDemo ? '' : 'cursor-pointer'} group`}
      onClick={() => handleCollectionClick({ ...col, isDemo })}
    >
      <div className="relative">
        <div className="aspect-video bg-gray-200 rounded-t-soft overflow-hidden">
          <img 
            src={col.imageUrl || (col.images && col.images[0])} 
            alt={col.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-medium" 
            onError={(e) => { 
              (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; 
            }} 
          />
        </div>
        <div className="absolute top-3 left-3 bg-black/50 rounded-full p-2">
          {privacyIcon(col.privacy)}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{col.name}</h3>
        <p className="text-text-secondary text-sm mb-4">{col.description}</p>
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            {col.memoryCount || (col.images && col.images.length)} memories
          </span>
          <span>{col.lastUpdated}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-text-primary mb-2">Memory Collections</h2>
            <p className="text-text-secondary">Organize your memories into meaningful collections</p>
          </div>
          {/* Sort and Filter Controls */}
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <select
              className="input text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="created">Creation Date</option>
              <option value="modified">Last Modified</option>
              <option value="count">Memory Count</option>
            </select>
            <select
              className="input text-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="year">This Year</option>
            </select>
            <button className="btn btn-secondary text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8 flex justify-end">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search collections..."
              className="input w-full pl-10 pr-4"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg className="w-5 h-5 text-secondary-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>

        {/* Demo Collections Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-text-primary mb-6">Demo Collections</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDemoCollections.map(col => renderCollectionCard(col, true))}
          </div>
        </div>

        {/* User Collections Section */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-text-primary mb-6">Your Collections</h3>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUserCollections.map(col => renderCollectionCard(col))}
              {/* Create New Collection Card */}
              <div 
                className="card border-2 border-dashed border-secondary-300 hover:border-accent transition-fast cursor-pointer group flex flex-col items-center justify-center" 
                style={{ minHeight: 320 }}
                onClick={() => setIsPopupOpen(true)}
              >
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-fast">
                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">Create New Collection</h3>
                  <p className="text-text-secondary text-sm">Organize your memories into a new collection</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <CreateCollectionPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleCreateCollection}
      />

      {selectedCollection && (
        <CollectionViewPopup
          isOpen={isViewPopupOpen}
          onClose={() => setIsViewPopupOpen(false)}
          collection={selectedCollection}
        />
      )}
    </div>
  );
};

export default Collections; 