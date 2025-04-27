
import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Creator Dashboard</h1>
      <div className="grid gap-4">
        <div className="glass p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Statistics</h2>
          <p className="text-streamixy-light">Views: 1.2K</p>
          <p className="text-streamixy-light">Followers: 500</p>
          <p className="text-streamixy-light">SYX Earned: 2,500</p>
        </div>
        <div className="glass p-4 rounded-lg">
          <h2 className="font-semibold mb-2">Recent Activity</h2>
          <div className="space-y-2">
            <p className="text-sm text-streamixy-light">New follower: @user123</p>
            <p className="text-sm text-streamixy-light">100 SYX received from @fan456</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
