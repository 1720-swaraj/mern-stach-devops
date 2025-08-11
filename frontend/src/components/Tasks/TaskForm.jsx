import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../Common/Button';
import Modal from '../Common/Modal';

const TaskForm = ({ isOpen, onClose, onSubmit, task, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        // Edit mode - populate form with task data
        setValue('title', task.title);
        setValue('description', task.description || '');
        setValue('priority', task.priority);
        setValue('status', task.status);
        setValue('category', task.category || '');
        setValue('dueDate', task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        setValue('tags', task.tags ? task.tags.join(', ') : '');
      } else {
        // Create mode - reset form
        reset({
          title: '',
          description: '',
          priority: 'medium',
          status: 'pending',
          category: '',
          dueDate: '',
          tags: ''
        });
      }
    }
  }, [isOpen, task, setValue, reset]);

  const handleFormSubmit = (data) => {
    // Process tags
    const processedData = {
      ...data,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
      dueDate: data.dueDate || null
    };

    onSubmit(processedData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task ? 'Edit Task' : 'Create New Task'}
      size="large"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="form-label">
            Task Title *
          </label>
          <input
            id="title"
            type="text"
            className={`form-input ${errors.title ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter task title"
            {...register('title', {
              required: 'Task title is required',
              maxLength: {
                value: 100,
                message: 'Title cannot exceed 100 characters'
              }
            })}
          />
          {errors.title && (
            <p className="form-error">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            className={`form-input ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Enter task description (optional)"
            {...register('description', {
              maxLength: {
                value: 500,
                message: 'Description cannot exceed 500 characters'
              }
            })}
          />
          {errors.description && (
            <p className="form-error">{errors.description.message}</p>
          )}
        </div>

        {/* Priority and Status Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="form-label">
              Priority
            </label>
            <select
              id="priority"
              className="form-input"
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-input"
              {...register('status')}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Category and Due Date Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <input
              id="category"
              type="text"
              className={`form-input ${errors.category ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., Work, Personal, Study"
              {...register('category', {
                maxLength: {
                  value: 50,
                  message: 'Category cannot exceed 50 characters'
                }
              })}
            />
            {errors.category && (
              <p className="form-error">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <input
              id="dueDate"
              type="date"
              className="form-input"
              {...register('dueDate')}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label htmlFor="tags" className="form-label">
            Tags
          </label>
          <input
            id="tags"
            type="text"
            className="form-input"
            placeholder="Enter tags separated by commas (e.g., urgent, meeting, review)"
            {...register('tags')}
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple tags with commas
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
          >
            {task ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
