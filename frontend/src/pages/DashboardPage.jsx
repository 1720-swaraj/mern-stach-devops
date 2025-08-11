import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import taskService from '../services/taskService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import {
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load task statistics
      const statsResponse = await taskService.getTaskStats();
      setStats(statsResponse.data);

      // Load recent tasks (last 5 created)
      const recentResponse = await taskService.getTasks({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      setRecentTasks(recentResponse.data.tasks);

      // Load upcoming tasks (tasks with due dates in the next 7 days)
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      const upcomingResponse = await taskService.getTasks({
        limit: 10,
        sortBy: 'dueDate',
        sortOrder: 'asc'
      });

      // Filter tasks with due dates in the next 7 days
      const filtered = upcomingResponse.data.tasks.filter(task => 
        task.dueDate && 
        new Date(task.dueDate) <= nextWeek &&
        task.status !== 'completed'
      );
      setUpcomingTasks(filtered);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTaskDueDateInfo = (task) => {
    if (!task.dueDate) return null;

    const dueDate = new Date(task.dueDate);
    const today = new Date();

    if (isPast(dueDate) && !isToday(dueDate)) {
      return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else if (isToday(dueDate)) {
      return { text: 'Due Today', color: 'text-orange-600', bgColor: 'bg-orange-50' };
    } else if (isTomorrow(dueDate)) {
      return { text: 'Due Tomorrow', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    } else {
      return { text: format(dueDate, 'MMM dd'), color: 'text-blue-600', bgColor: 'bg-blue-50' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" className="text-primary-600 mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg text-white p-6">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-primary-100">
          Here's an overview of your tasks and productivity
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body flex items-center">
            <div className="flex-shrink-0">
              <ClipboardDocumentListIcon className="w-10 h-10 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.statusStats?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.statusStats?.completed || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="w-10 h-10 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.statusStats?.['in-progress'] || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats?.overdueTasks || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="card-body">
            {recentTasks.length > 0 ? (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500">
                        {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`badge ${task.status === 'completed' ? 'badge-success' : task.status === 'in-progress' ? 'badge-info' : 'badge-warning'}`}>
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ClipboardDocumentListIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No tasks yet</p>
                <Link
                  to="/tasks"
                  className="inline-flex items-center mt-2 text-primary-600 hover:text-primary-700"
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Create your first task
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="card">
          <div className="card-header flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming & Overdue</h2>
            <Link
              to="/tasks"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="card-body">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map((task) => {
                  const dueDateInfo = getTaskDueDateInfo(task);
                  return (
                    <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <div className="flex items-center mt-1">
                          <CalendarIcon className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">
                            {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                          </span>
                        </div>
                      </div>
                      {dueDateInfo && (
                        <span className={`text-xs px-2 py-1 rounded-full ${dueDateInfo.color} ${dueDateInfo.bgColor}`}>
                          {dueDateInfo.text}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming tasks</p>
                <p className="text-sm text-gray-400">Tasks with due dates will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/tasks"
              className="flex items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
            >
              <PlusIcon className="w-5 h-5 text-primary-600 mr-2" />
              <span className="text-primary-700 font-medium">Create New Task</span>
            </Link>
            <Link
              to="/tasks?status=pending"
              className="flex items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
            >
              <ClockIcon className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-yellow-700 font-medium">View Pending Tasks</span>
            </Link>
            <Link
              to="/tasks?status=completed"
              className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-700 font-medium">View Completed</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
