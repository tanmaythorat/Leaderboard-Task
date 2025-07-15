import React, { useState } from 'react';
import { Trophy, Users, Medal, Crown } from 'lucide-react';

const Leaderboard = ({ users, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;


  // Returns rank suffix like 1st, 2nd, 3rd, etc.
  const getRankSuffix = (rank) => {
    const j = rank % 10, k = rank % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

    // Color code ranks for top 3
  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-500';
    return 'text-gray-600';
  };

    // Sort users by total points descending
  const sortedUsers = [...users].sort((a, b) => b.totalPoints - a.totalPoints);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const currentUsers = sortedUsers.slice(startIdx, startIdx + usersPerPage);

  const changePage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Trophy size={24} />
          Leaderboard
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Users size={16} />
          {users.length} users
        </div>
      </div>

      {loading && users.length === 0 ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : sortedUsers.length === 0 ? (
        <div className="text-center py-8">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No users found</p>
          <p className="text-sm text-gray-400">Add some users to get started!</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {currentUsers.map((user, index) => {
              const globalRank = startIdx + index + 1;
              return (
                <div
                  key={user._id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                    globalRank === 1
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300'
                      : globalRank === 2
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300'
                      : globalRank === 3
                      ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-orange-300'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`text-2xl font-bold ${getRankColor(globalRank)} relative`}>
                      {globalRank === 1 && <Crown className="absolute -top-2 -right-2 text-yellow-500" size={16} />}
                      {globalRank}
                      <span className="text-sm">{getRankSuffix(globalRank)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
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
                  </div>
                  <div className="text-right">
                    {globalRank <= 3 && (
                      <div className="text-3xl mb-1">
                        {globalRank === 1 ? '🥇' : globalRank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Rank #{globalRank}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-6 gap-2 text-sm">
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => changePage(i + 1)}
                className={`px-3 py-1 rounded-md border ${
                  currentPage === i + 1
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-md border text-gray-600 hover:bg-gray-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
