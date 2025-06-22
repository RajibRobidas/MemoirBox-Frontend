import React from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => (
  <div className="mb-4 flex items-center gap-2">
    <div className="relative flex-1">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="input w-full pl-12 pr-10"
        placeholder="Search memories by title, location, or tags..."
      />
      <svg className="w-5 h-5 text-secondary-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-text-primary"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      )}
    </div>
  </div>
);

export default SearchBar; 