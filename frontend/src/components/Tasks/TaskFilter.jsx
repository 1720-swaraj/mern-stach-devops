import React from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import Button from '../Common/Button';

const TaskFilter = ({
  filters,
  onFilterChange,
  onSearch,
  searchTerm,
  onClearFilters
}) => {
  const handleInputChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== '' && value !== 'all');
  };

  return (
    <div className="card mb-6">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filter Tasks
          </h3>
          {hasActiveFilters() && (
            <Button
              variant="outline"
              size="small"
              onClick={onClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </div>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className="form-input"
                value={filters.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                className="form-input"
                value={filters.priority || ''}
                onChange={(e) => handleInputChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <input
                id="category"
                type="text"
                placeholder="Filter by category"
                className="form-input"
                value={filters.category || ''}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            </div>

            {/* Sort By */}
            <div>
              <label htmlFor="sortBy" className="form-label">
                Sort By
              </label>
              <select
                id="sortBy"
                className="form-input"
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => handleInputChange('sortBy', e.target.value)}
              >
                <option value="createdAt">Created Date</option>
                <option value="updatedAt">Updated Date</option>
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          {/* Sort Order */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Sort Order:</span>
            <label className="flex items-center">
              <input
                type="radio"
                name="sortOrder"
                value="desc"
                checked={filters.sortOrder === 'desc'}
                onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Newest First</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="sortOrder"
                value="asc"
                checked={filters.sortOrder === 'asc'}
                onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Oldest First</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;
