import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  CheckCircleIcon,
  ClockIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  DevicePhoneMobileIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: CheckCircleIcon,
      title: 'Task Management',
      description: 'Create, edit, and organize your tasks with priorities and due dates.'
    },
    {
      icon: ClockIcon,
      title: 'Real-time Updates',
      description: 'Get instant updates on task progress and deadline notifications.'
    },
    {
      icon: UserGroupIcon,
      title: 'User-Friendly',
      description: 'Intuitive interface designed for productivity and ease of use.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure',
      description: 'Your data is protected with industry-standard security measures.'
    },
    {
      icon: DevicePhoneMobileIcon,
      title: 'Responsive',
      description: 'Access your tasks from any device with our responsive design.'
    },
    {
      icon: CloudIcon,
      title: 'Cloud-Based',
      description: 'Your tasks are stored securely in the cloud and accessible anywhere.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Organize Your Tasks,{' '}
              <span className="text-primary-200">Boost Your Productivity</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
              A powerful and intuitive task management application built with the MERN stack. 
              Keep track of your tasks, set priorities, and never miss a deadline.
            </p>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary-600 transition-colors text-lg"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Stay Organized
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our task manager comes packed with features to help you manage your work efficiently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 mx-auto mb-4 text-primary-600">
                  <feature.icon className="w-full h-full" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Tasks Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">1K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">99%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="py-16 bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Organized?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of users who have already improved their productivity
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Start Your Free Account
            </Link>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">TaskManager</h3>
            <p className="text-gray-400 mb-4">
              Built with MERN Stack - MongoDB, Express, React, and Node.js
            </p>
            <div className="text-sm text-gray-500">
              © 2025 TaskManager. A demo application for portfolio purposes.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
