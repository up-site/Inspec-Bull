import React from 'react';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Blog Posts</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Courses</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;