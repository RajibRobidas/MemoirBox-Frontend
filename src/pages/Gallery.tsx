import React from 'react';
import { Link } from 'react-router-dom';
import MemoryCard from '../components/MemoryCard';
import { memoryService } from '../services/api';
import SearchBar from './Gallery/SearchBar';
import FilterSidebar from './Gallery/FilterSidebar';

interface Memory {
  id: string;
  title: string;
  date: string;
  imageUrl: string;
  collection: string;
  collectionColor: string;
}

// Demo memories
const demoMemories: Memory[] = [
  {
    id: '1',
    title: 'Family Beach Day',
    date: 'March 15, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    collection: 'Family Moments',
    collectionColor: 'bg-accent'
  },
  {
    id: '2',
    title: 'Mountain Hiking Adventure',
    date: 'March 10, 2024',
    imageUrl: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    collection: 'Travel Adventures',
    collectionColor: 'bg-success'
  },
  {
    id: '3',
    title: 'Birthday Celebration',
    date: 'March 8, 2024',
    imageUrl: 'https://images.pixabay.com/photo/2017/07/21/23/57/concert-2527495_1280.jpg',
    collection: 'Celebrations',
    collectionColor: 'bg-warning'
  },
  {
    id: '4',
    title: 'Nature Walk',
    date: 'March 5, 2024',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3',
    collection: 'Travel Adventures',
    collectionColor: 'bg-success'
  },
  {
    id: '5',
    title: 'Wedding Day',
    date: 'February 28, 2024',
    imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    collection: 'Celebrations',
    collectionColor: 'bg-warning'
  },
  {
    id: '6',
    title: 'Stargazing Night',
    date: 'February 25, 2024',
    imageUrl: 'https://images.pixabay.com/photo/2016/11/29/05/45/astronomy-1867616_1280.jpg',
    collection: 'Family Moments',
    collectionColor: 'bg-accent'
  },
  {
    id: '7',
    title: 'Picnic in the Park',
    date: 'March 20, 2024',
    imageUrl: 'https://i.pinimg.com/736x/d1/d5/95/d1d5957bcbc7816485634f69263f20b7.jpg',
    collection: 'Family Moments',
    collectionColor: 'bg-accent'
  },
  {
    id: '8',
    title: 'Sunset Memories',
    date: 'March 21, 2024',
    imageUrl: 'https://i.pinimg.com/736x/81/f0/d4/81f0d484f859cac49fad34ffba62c3de.jpg',
    collection: 'Travel Adventures',
    collectionColor: 'bg-success'
  },
  {
    id: '9',
    title: 'Joyful Gathering',
    date: 'March 22, 2024',
    imageUrl: 'https://i.pinimg.com/736x/ff/de/a3/ffdea3d59e1d110fae891ff5984dce3b.jpg',
    collection: 'Celebrations',
    collectionColor: 'bg-warning'
  },
  {
    id: '10',
    title: 'Friends Forever',
    date: 'March 23, 2024',
    imageUrl: 'https://i.pinimg.com/736x/75/f7/b5/75f7b5aacca7a44ec11c0323bfeda881.jpg',
    collection: 'Friendship',
    collectionColor: 'bg-primary'
  }
];

const Gallery: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [isMultiSelectMode, setIsMultiSelectMode] = React.useState(false);
  const [selectedMemories, setSelectedMemories] = React.useState<Set<string>>(new Set());
  const [mainSearch, setMainSearch] = React.useState('');
  const [filterSearchActive, setFilterSearchActive] = React.useState(false);
  const [filtersChanged, setFiltersChanged] = React.useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
  
  // States for real memories
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [userMemories, setUserMemories] = React.useState<Memory[]>([]);

  // Sidebar filter states
  const [filterStartDate, setFilterStartDate] = React.useState<string>('');
  const [filterEndDate, setFilterEndDate] = React.useState<string>('');
  const [filterCollections, setFilterCollections] = React.useState<string[]>([]);
  const [filterFileTypes, setFilterFileTypes] = React.useState<string[]>(['Photos', 'Videos']); // default checked
  const [filterTags, setFilterTags] = React.useState<string[]>([]);

  // Function to load user memories
  const loadUserMemories = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const memories = await memoryService.getMemories();
      // Transform the memories to match our Memory interface
      const transformedMemories = memories.map((memory: any) => ({
        id: memory._id,
        title: memory.title,
        date: new Date(memory.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        imageUrl: memory.imageUrls && memory.imageUrls.length > 0 ? memory.imageUrls[0] : '',
        collection: memory.tags[0] || 'Uncategorized',
        collectionColor: getRandomColor()
      }));
      setUserMemories(transformedMemories);
    } catch (err) {
      setError('Failed to load memories');
      console.error('Error loading memories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to get a random color for collection tags
  const getRandomColor = () => {
    const colors = ['bg-accent', 'bg-success', 'bg-warning', 'bg-info', 'bg-primary'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Load user memories on component mount
  React.useEffect(() => {
    loadUserMemories();
  }, [loadUserMemories]);

  const handleMemorySelect = (id: string) => {
    setSelectedMemories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleMultiSelectToggle = () => {
    setIsMultiSelectMode(!isMultiSelectMode);
    if (!isMultiSelectMode) {
      setSelectedMemories(new Set());
    }
  };

  const handleSort = (type: 'date' | 'title') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  // Combine demo and user memories
  const allMemories = React.useMemo(() => {
    return [...demoMemories, ...userMemories];
  }, [userMemories]);

  const sortedMemories = React.useMemo(() => {
    return [...allMemories].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });
  }, [allMemories, sortBy, sortOrder]);

  // Unique collections for filter checkboxes
  const allCollections = React.useMemo(() => {
    const set = new Set<string>();
    [...demoMemories, ...userMemories].forEach(m => set.add(m.collection));
    return Array.from(set);
  }, [userMemories]);

  // Unique tags for filter buttons (demo only, for now)
  const allTags = ['family', 'vacation', 'birthday', 'wedding', 'holiday'];

  // When any filter changes, allow filter search again
  React.useEffect(() => {
    setFiltersChanged(true);
    setFilterSearchActive(false);
  }, [filterStartDate, filterEndDate, filterCollections, filterFileTypes, filterTags]);

  // Main search: only by title/collection
  const mainSearchedMemories = React.useMemo(() => {
    return sortedMemories.filter(memory =>
      memory.title.toLowerCase().includes(mainSearch.toLowerCase()) ||
      memory.collection.toLowerCase().includes(mainSearch.toLowerCase())
    );
  }, [sortedMemories, mainSearch]);

  // Filtered memories: all filters (used when filter search is active)
  const filteredMemories = React.useMemo(() => {
    return mainSearchedMemories.filter(memory => {
      // Date range
      let matchesDate = true;
      if (filterStartDate) {
        const memDate = new Date(memory.date);
        const start = new Date(filterStartDate);
        if (memDate < start) matchesDate = false;
      }
      if (filterEndDate) {
        const memDate = new Date(memory.date);
        const end = new Date(filterEndDate);
        if (memDate > end) matchesDate = false;
      }
      // Collections
      const matchesCollection =
        filterCollections.length === 0 || filterCollections.includes(memory.collection);
      // File types (future extensibility, always true for now)
      const matchesFileType = true;
      // Tags (demo only)
      const matchesTags =
        filterTags.length === 0 || filterTags.some(tag => memory.title.toLowerCase().includes(tag));
      return matchesDate && matchesCollection && matchesFileType && matchesTags;
    });
  }, [mainSearchedMemories, filterStartDate, filterEndDate, filterCollections, filterFileTypes, filterTags]);

  // Reverse the order of displayed memories
  const displayedMemories = (filterSearchActive ? filteredMemories : mainSearchedMemories).slice().reverse();

  // Handlers for sidebar filters
  const handleCollectionFilterChange = (collection: string) => {
    setFilterCollections(prev =>
      prev.includes(collection)
        ? prev.filter(c => c !== collection)
        : [...prev, collection]
    );
  };
  const handleFileTypeChange = (type: string) => {
    setFilterFileTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };
  const handleTagFilter = (tag: string) => {
    setFilterTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  const handleResetFilters = () => {
    setFilterStartDate('');
    setFilterEndDate('');
    setFilterCollections([]);
    setFilterFileTypes(['Photos', 'Videos']);
    setFilterTags([]);
  };

  // Add share functionality to the Share button in the multi-select action bar
  const handleShare = () => {
    const selected = displayedMemories.filter(m => selectedMemories.has(m.id));
    if (selected.length === 0) return;
    // Only share the image URLs (database URLs)
    const shareText = selected.map(m => m.imageUrl).filter(Boolean).join('\n');
    if (navigator.share) {
      navigator.share({
        title: 'Shared Memories',
        text: shareText
      });
    } else {
      // Fallback: open a mailto link with just the image URLs
      const encoded = encodeURIComponent(shareText);
      window.open(`mailto:?subject=Shared Memories&body=${encoded}`);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Controls Header */}
        <div className="mb-6">
          {/* Main Search Bar (like Collections) */}
          <SearchBar
            searchQuery={mainSearch}
            setSearchQuery={setMainSearch}
          />
          {/* Filter search button with filter icon */}
          <div className="flex items-center gap-2 mb-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${filtersChanged ? 'bg-accent text-white' : 'bg-gray-200 text-text-secondary'} hover:bg-accent/90 transition-fast`}
              onClick={() => { setFilterSearchActive(true); setFiltersChanged(false); }}
              type="button"
              disabled={!filtersChanged}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
              </svg>
              Filter Search
            </button>
            <span className="text-xs text-text-secondary">(Click to apply sidebar filters)</span>
          </div>
          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* View Toggle and Filter */}
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-surface shadow-subtle text-accent' : 'text-secondary-400 hover:text-text-primary'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-surface shadow-subtle text-accent' : 'text-secondary-400 hover:text-text-primary'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                  </svg>
                </button>
              </div>
              {/* Filter Button */}
              <button 
                onClick={() => setIsFilterModalOpen(true)}
                className="btn btn-secondary"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"/>
                </svg>
                Filters
              </button>
            </div>
            {/* Sort and Multi-select */}
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleSort('date')}
                  className={`p-2 rounded-md ${sortBy === 'date' ? 'bg-surface shadow-subtle text-accent' : 'text-secondary-400 hover:text-text-primary'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleSort('title')}
                  className={`p-2 rounded-md ${sortBy === 'title' ? 'bg-surface shadow-subtle text-accent' : 'text-secondary-400 hover:text-text-primary'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/>
                  </svg>
                </button>
              </div>
              <button 
                onClick={handleMultiSelectToggle}
                className={`btn ${isMultiSelectMode ? 'btn-primary' : 'btn-secondary'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                {isMultiSelectMode ? 'Done' : 'Select'}
              </button>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        <div className="flex gap-6">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <FilterSidebar
              filterStartDate={filterStartDate}
              setFilterStartDate={setFilterStartDate}
              filterEndDate={filterEndDate}
              setFilterEndDate={setFilterEndDate}
              allCollections={allCollections}
              filterCollections={filterCollections}
              handleCollectionFilterChange={handleCollectionFilterChange}
              filterFileTypes={filterFileTypes}
              handleFileTypeChange={handleFileTypeChange}
              allTags={allTags}
              filterTags={filterTags}
              handleTagFilter={handleTagFilter}
              handleResetFilters={handleResetFilters}
            />
          </div>

          {/* Gallery Grid/List */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-text-secondary">
                Showing {displayedMemories.length} memories
                {userMemories.length > 0 && ` (${userMemories.length} personal)`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-error/10 text-error rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <button 
                  onClick={loadUserMemories}
                  className="btn btn-sm btn-error"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="mb-6 p-4 bg-info/10 text-info rounded-lg flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-info" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading your memories...
              </div>
            )}

            {/* Gallery Grid/List */}
            {displayedMemories.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {displayedMemories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      {...memory}
                      onSelect={handleMemorySelect}
                      isMultiSelectMode={isMultiSelectMode}
                      isSelected={selectedMemories.has(memory.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedMemories.map((memory) => (
                    <div key={memory.id} className="card p-4 flex items-center gap-4">
                      <div className="w-24 h-24 flex-shrink-0">
                        <img
                          src={memory.imageUrl}
                          alt={memory.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-text-primary">{memory.title}</h3>
                        <p className="text-sm text-text-secondary">{memory.date}</p>
                        <span className={`inline-block px-2 py-1 mt-2 ${memory.collectionColor} text-white text-xs rounded-full`}>
                          {memory.collection}
                        </span>
                      </div>
                      {isMultiSelectMode && (
                        <div className="flex-shrink-0">
                          <input
                            type="checkbox"
                            className="w-5 h-5 text-accent focus:ring-accent rounded"
                            checked={selectedMemories.has(memory.id)}
                            onChange={() => handleMemorySelect(memory.id)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center text-text-secondary py-8">No memories found.</div>
            )}
          </div>
        </div>
      </main>

      {/* Multi-select Action Bar */}
      {isMultiSelectMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-300 border-t border-white/10 p-4 shadow-large z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-black">
                {selectedMemories.size} selected
              </span>
              <button className="text-sm text-accent-200 hover:text-accent-100 transition-colors">
                Select All
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-300"
                onClick={handleShare}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-xl hover:bg-accent/90 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-error text-white rounded-xl hover:bg-error/90 transition-all duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery; 