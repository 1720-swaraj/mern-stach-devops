import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import taskService from '../services/taskService';
import TaskList from '../components/Tasks/TaskList';
import TaskForm from '../components/Tasks/TaskForm';
import TaskFilter from '../components/Tasks/TaskFilter';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { PlusIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const TasksPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category: searchParams.get('category') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 12
  });

  useEffect(() => {
    loadTasks();
  }, [filters, searchTerm]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      }
    });
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    setSearchParams(params);
  }, [filters, searchTerm, setSearchParams]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const params = { ...filters };

      if (searchTerm) {
        // For search, we'll filter on the frontend for simplicity
        // In a real app, you'd implement server-side search
      }

      const response = await taskService.getTasks(params);

      let filteredTasks = response.data.tasks;

      // Client-side search filtering
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredTasks = filteredTasks.filter(task =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.category?.toLowerCase().includes(searchLower) ||
          task.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      setTasks(filteredTasks);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      category: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    });
    setSearchTerm('');
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      setSubmitting(true);

      if (editingTask) {
        // Update existing task
        await taskService.updateTask(editingTask._id, taskData);
        toast.success('Task updated successfully!');
      } else {
        // Create new task
        await taskService.createTask(taskData);
        toast.success('Task created successfully!');
      }

      closeForm();
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await taskService.deleteTask(taskId);
      toast.success('Task deleted successfully!');
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await taskService.toggleTask(taskId);
      toast.success('Task status updated!');
      loadTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task status');
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Tasks</h1>
          <p className="mt-2 text-gray-600">
            Manage and organize your tasks efficiently
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={openCreateForm}
            icon={PlusIcon}
            className="w-full sm:w-auto"
          >
            Add New Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TaskFilter
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        searchTerm={searchTerm}
        onClearFilters={clearFilters}
      />

      {/* Task List */}
      <TaskList
        tasks={tasks}
        loading={loading}
        onEdit={openEditForm}
        onDelete={handleDeleteTask}
        onToggleComplete={handleToggleComplete}
        emptyMessage={searchTerm ? `No tasks found for "${searchTerm}"` : "No tasks found"}
      />

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={!pagination.hasPrev}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={!pagination.hasNext}
            >
              Next
            </Button>
          </div>

          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{' '}
                <span className="font-medium">
                  {(pagination.currentPage - 1) * filters.limit + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalTasks)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.totalTasks}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="rounded-r-none"
                >
                  Previous
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={pagination.currentPage === pageNum ? "primary" : "outline"}
                      size="small"
                      onClick={() => handlePageChange(pageNum)}
                      className="rounded-none"
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="small"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="rounded-l-none"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleSubmitTask}
        task={editingTask}
        isLoading={submitting}
      />
    </div>
  );
};

export default TasksPage;
