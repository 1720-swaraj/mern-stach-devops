import React from 'react';
import TaskCard from './TaskCard';
import LoadingSpinner from '../Common/LoadingSpinner';

const TaskList = ({ 
  tasks, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleComplete,
  emptyMessage = "No tasks found"
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" className="text-primary-600" />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {emptyMessage}
        </h3>
        <p className="text-gray-500">
          Create your first task to get started with organizing your work.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div key={task._id} className="fade-in">
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
