import React from 'react';
import { format } from 'date-fns';
import {
  CheckCircleIcon,
  ClockIcon,
  TrashIcon,
  PencilIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Button from '../Common/Button';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`card hover:shadow-md transition-shadow ${task.status === 'completed' ? 'opacity-75' : ''}`}>
      <div className="card-body">
        {/* Header with title and priority */}
        <div className="flex items-start justify-between mb-3">
          <h3 className={`font-semibold text-gray-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
            {task.title}
          </h3>
          <span className={`badge border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Due date */}
        {task.dueDate && (
          <div className={`flex items-center text-sm mb-3 ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              {isOverdue && <span className="ml-1 font-medium">(Overdue)</span>}
            </span>
          </div>
        )}

        {/* Status and category */}
        <div className="flex items-center justify-between mb-4">
          <span className={`badge ${getStatusColor(task.status)}`}>
            {task.status.replace('-', ' ')}
          </span>
          {task.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {task.category}
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="small"
              onClick={() => onToggleComplete(task._id)}
              icon={CheckCircleIcon}
              className={task.status === 'completed' ? 'text-green-600' : 'text-gray-500'}
            >
              {task.status === 'completed' ? 'Completed' : 'Complete'}
            </Button>
          </div>

          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="small"
              onClick={() => onEdit(task)}
              icon={PencilIcon}
              className="text-blue-600 hover:text-blue-700"
            />
            <Button
              variant="ghost"
              size="small"
              onClick={() => onDelete(task._id)}
              icon={TrashIcon}
              className="text-red-600 hover:text-red-700"
            />
          </div>
        </div>

        {/* Timestamps */}
        <div className="mt-3 pt-3 border-t text-xs text-gray-400">
          <div className="flex justify-between">
            <span>Created: {format(new Date(task.createdAt), 'MMM dd, yyyy')}</span>
            {task.completedAt && (
              <span>Completed: {format(new Date(task.completedAt), 'MMM dd, yyyy')}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
