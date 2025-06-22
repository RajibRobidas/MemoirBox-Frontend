import React from 'react';

interface FilterSidebarProps {
  filterStartDate: string;
  setFilterStartDate: (v: string) => void;
  filterEndDate: string;
  setFilterEndDate: (v: string) => void;
  allCollections: string[];
  filterCollections: string[];
  handleCollectionFilterChange: (col: string) => void;
  filterFileTypes: string[];
  handleFileTypeChange: (type: string) => void;
  allTags: string[];
  filterTags: string[];
  handleTagFilter: (tag: string) => void;
  handleResetFilters: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filterStartDate,
  setFilterStartDate,
  filterEndDate,
  setFilterEndDate,
  allCollections,
  filterCollections,
  handleCollectionFilterChange,
  filterFileTypes,
  handleFileTypeChange,
  allTags,
  filterTags,
  handleTagFilter,
  handleResetFilters,
}) => (
  <div className="card p-6 sticky top-24">
    <h3 className="text-lg font-semibold text-text-primary mb-4">Filters</h3>
    {/* Date Range */}
    <div className="mb-6">
      <h4 className="text-sm font-medium text-text-primary mb-3">Date Range</h4>
      <div className="space-y-3">
        <input type="date" className="input w-full text-sm" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
        <input type="date" className="input w-full text-sm" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
      </div>
    </div>
    {/* Collections */}
    <div className="mb-6">
      <h4 className="text-sm font-medium text-text-primary mb-3">Collections</h4>
      <div className="space-y-2">
        {allCollections.map(col => (
          <label className="flex items-center" key={col}>
            <input
              type="checkbox"
              className="text-accent focus:ring-accent rounded"
              checked={filterCollections.includes(col)}
              onChange={() => handleCollectionFilterChange(col)}
            />
            <span className="ml-2 text-sm text-text-secondary">{col}</span>
          </label>
        ))}
      </div>
    </div>
    {/* File Types */}
    <div className="mb-6">
      <h4 className="text-sm font-medium text-text-primary mb-3">File Types</h4>
      <div className="space-y-2">
        {['Photos', 'Videos', 'Documents'].map(type => (
          <label className="flex items-center" key={type}>
            <input
              type="checkbox"
              className="text-accent focus:ring-accent rounded"
              checked={filterFileTypes.includes(type)}
              onChange={() => handleFileTypeChange(type)}
            />
            <span className="ml-2 text-sm text-text-secondary">{type}</span>
          </label>
        ))}
      </div>
    </div>
    {/* Tags */}
    <div className="mb-6">
      <h4 className="text-sm font-medium text-text-primary mb-3">Popular Tags</h4>
      <div className="flex flex-wrap gap-2">
        {allTags.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 text-xs rounded-full transition-fast ${filterTags.includes(tag) ? 'bg-accent/10 text-accent' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
            onClick={() => handleTagFilter(tag)}
            type="button"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
    <button className="btn btn-secondary w-full" onClick={handleResetFilters}>Reset Filters</button>
  </div>
);

export default FilterSidebar; 