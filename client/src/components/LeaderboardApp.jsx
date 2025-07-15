/* Placeholder for LeaderboardApp.jsx full content */import React, { useState, useEffect } from 'react';
import { Users, Trophy, Plus, Clock, Star } from 'lucide-react';

// API base URL - adjust this to match your backend
const API_BASE_URL = 'http://localhost:5000/api';

// API helper function
const apiRequest = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

const LeaderboardApp = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [claimHistory, setClaimHistory] = useState([]);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // API Functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`${API_BASE_URL}/users`);
      setUsers(data);
    } catch (error) {
      showMessage('Error fetching users: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUserName.trim()) {
      showMessage('Please enter a valid name', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify({
          name: newUserName.trim()
        })
      });
      
      if (data.success) {
        showMessage(`User "${newUserName}" added successfully!`, 'success');
        setNewUserName('');
        setShowAddUser(false);
        fetchUsers(); // Refresh the user list
      }
    } catch (error) {
      showMessage('Error adding user: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const claimPoints = async () => {
    if (!selectedUserId) {
      showMessage('Please select a user first', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await apiRequest(`${API_BASE_URL}/claim`, {
        method: 'POST',
        body: JSON.stringify({
          userId: selectedUserId
        })
      });
      
      if (data.success) {
        const points = data.points;
        const userName = users.find(u => u._id === selectedUserId)?.name;
        showMessage(`${userName} claimed ${points} points!`, 'success');
        fetchUsers(); // Refresh to update rankings
      }
    } catch (error) {
      showMessage('Error claiming points: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimHistory = async () => {
    try {
      setLoading(true);
      const url = selectedUserForHistory 
        ? `${API_BASE_URL}/history/${selectedUserForHistory}`
        : `${API_BASE_URL}/history`;
      
      const data = await apiRequest(url);
      setClaimHistory(data);
    } catch (error) {
      showMessage('Error fetching claim history: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, type) => {
    setMessage({ text: msg, type });
    setTimeout(() => setMessage(''), 3000);
  };

  // Toggle history view
  const toggleHistory = () => {
    setShowHistory(!showHistory);
    if (!showHistory) {
      fetchClaimHistory();
    }
  };

  // Get rank suffix
  const getRankSuffix = (rank) => {
    const j = rank % 10;
    const k = rank % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  // Get rank color
  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-500';
    return 'text-gray-600';
  };

  // Sort users by points for ranking
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Trophy className="text-yellow-500" size={40} />
            Leaderboard System
          </h1>
          <p className="text-gray-600">Claim points and climb the rankings!</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add User Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Plus size={20} />
                  Add User
                </h2>
                <button
                  onClick={() => setShowAddUser(!showAddUser)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {showAddUser ? 'Cancel' : 'Add New'}
                </button>
              </div>
              
              {showAddUser && (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Enter user name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && addUser()}
                  />
                  <button
                    onClick={addUser}
                    disabled={loading || !newUserName.trim()}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? 'Adding...' : 'Add User'}
                  </button>
                </div>
              )}
            </div>

            {/* Claim Points Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Star size={20} />
                Claim Points
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select User
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.totalPoints} pts)
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={claimPoints}
                  disabled={loading || !selectedUserId}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-md hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold"
                >
                  {loading ? 'Claiming...' : '🎲 Claim Random Points (1-10)'}
                </button>
              </div>
            </div>

            {/* History Toggle */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <button
                onClick={toggleHistory}
                className="w-full flex items-center justify-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
              >
                <Clock size={20} />
                {showHistory ? 'Hide' : 'Show'} Claim History
              </button>
              
              {showHistory && (
                <div className="mt-4 space-y-3">
                  <select
                    value={selectedUserForHistory}
                    onChange={(e) => {
                      setSelectedUserForHistory(e.target.value);
                      setTimeout(fetchClaimHistory, 100);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Users</option>
                    {users.map(user => (
                      <option key={user._id} value={user._id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Leaderboard */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Users size={24} />
                Leaderboard
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({users.length} users)
                </span>
              </h2>

              {loading && users.length === 0 ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {sortedUsers.map((user, index) => {
                    const rank = index + 1;
                    return (
                      <div
                        key={user._id}
                        className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                          rank === 1
                            ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
                            : rank === 2
                            ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
                            : rank === 3
                            ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300'
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`text-2xl font-bold ${getRankColor(rank)}`}>
                            {rank}
                            <span className="text-sm">{getRankSuffix(rank)}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800 text-lg">
                              {user.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {user.totalPoints} points
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {rank <= 3 && (
                            <div className="text-2xl mb-1">
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            Rank #{rank}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Claim History */}
            {showHistory && (
              <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Claim History
                  {selectedUserForHistory && (
                    <span className="text-sm font-normal text-gray-500">
                      - {users.find(u => u._id === selectedUserForHistory)?.name}
                    </span>
                  )}
                </h2>

                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading history...</p>
                  </div>
                ) : claimHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No claim history found</p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {claimHistory.map((claim, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {claim.userName || 'Unknown User'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(claim.claimedAt).toLocaleDateString()} at{' '}
                            {new Date(claim.claimedAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">
                            +{claim.points}
                          </p>
                          <p className="text-sm text-gray-500">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardApp;