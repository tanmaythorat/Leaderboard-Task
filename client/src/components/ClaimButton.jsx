import React, { useState } from 'react';
import { Star, Zap } from 'lucide-react';
import { userService } from '../services/api';

const ClaimButton = ({ selectedUserId, users, onPointsClaimed, onMessage }) => {
  const [loading, setLoading] = useState(false);

  const claimPoints = async () => {
    if (!selectedUserId) {
      onMessage('Please select a user first', 'error');
      return;
    }

    try {
      setLoading(true);
      const data = await userService.claimPoints(selectedUserId);

      const points = data.points || Math.floor(Math.random() * 10) + 1; // fallback
      const userName = users.find(u => u._id === selectedUserId)?.name || 'User';

      if (data.success || data.points !== undefined) {
        onMessage(`${userName} successfully claimed 🎉 ${points} points!`, 'success');
        onPointsClaimed(); // refresh points display
      } else {
        onMessage('Something went wrong while claiming points.', 'error');
      }

    } catch (error) {
      onMessage('Error claiming points: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectedUser = users.find(u => u._id === selectedUserId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Star size={20} />
        Claim Points
      </h2>

      <div className="space-y-4">
        {selectedUser && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">
                  {selectedUser.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{selectedUser.name}</h3>
                <p className="text-sm text-gray-600">
                  Current Points: {selectedUser.totalPoints}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={claimPoints}
          disabled={loading || !selectedUserId}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-md hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 font-semibold flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Claiming...
            </>
          ) : (
            <>
              <Zap size={20} />
              🎲 Claim Random Points (1-10)
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClaimButton;
