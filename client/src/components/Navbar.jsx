import React from 'react';
import { Trophy, Users, Clock } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, userCount }) => {
  const navItems = [
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'actions', label: 'User Actions', icon: Users },
    { id: 'history', label: 'Claim History', icon: Clock }
  ];

  return (
    <nav className="bg-white shadow-md border-b-2 border-blue-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between h-auto gap-4 py-3 sm:h-16 sm:gap-0">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Trophy className="text-yellow-500" size={32} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Leaderboard System</h1>
              <p className="text-xs text-gray-500">
                {userCount} users registered
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
