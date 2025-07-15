import React, { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';

import Navbar from './components/Navbar';
import AddUser from './components/AddUser';
import UserSelect from './components/UserSelect';
import ClaimButton from './components/ClaimButton';
import Leaderboard from './components/Leaderboard';
import ClaimHistory from './components/ClaimHistory';
import { userService } from './services/api';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('leaderboard');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data);
    } catch (error) {
      showMessage('Error fetching users: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type = 'default') => {
    const toastFn = {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warn,
      default: toast
    }[type] || toast;

    toastFn(msg);
  };

  const handleUserAdded = () => {
    fetchUsers();
    showMessage('User added successfully!', 'success');
  };

  const handlePointsClaimed = () => {
    fetchUsers();
  };

  const handleUserSelect = (userId) => {
    setSelectedUserId(userId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'leaderboard':
        return <Leaderboard users={users} loading={loading} />;
      case 'actions':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AddUser onUserAdded={handleUserAdded} onMessage={showMessage} />
            <UserSelect
              users={users}
              selectedUserId={selectedUserId}
              onUserSelect={handleUserSelect}
            />
            <ClaimButton
              selectedUserId={selectedUserId}
              users={users}
              onPointsClaimed={handlePointsClaimed}
              onMessage={showMessage}
              onResetSelection={() => setSelectedUserId('')} 
            />
          </div>
        );
      case 'history':
        return <ClaimHistory users={users} onMessage={showMessage} />;
      default:
        return <Leaderboard users={users} loading={loading} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userCount={users.length}
      />

      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 mt-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {activeTab === 'leaderboard' && 'Top Rankings'}
              {activeTab === 'actions' && 'User Management'}
              {activeTab === 'history' && 'Points History'}
            </h1>
            <p className="text-gray-600">
              {activeTab === 'leaderboard' && "See who's leading the pack!"}
              {activeTab === 'actions' && 'Add users and claim points'}
              {activeTab === 'history' && 'Track all point claims'}
            </p>
          </div>

          {renderContent()}
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default App;
