import React, { useState, useEffect } from "react";
import { Clock, Filter, User, Calendar } from "lucide-react";
import { userService } from "../services/api";

const ClaimHistory = ({ users, onMessage }) => {

    // Store claim history records and selected user
  const [claimHistory, setClaimHistory] = useState([]);
  const [selectedUserForHistory, setSelectedUserForHistory] = useState("");

  const [loading, setLoading] = useState(false); // Controls loading spinner
  const [isOpen, setIsOpen] = useState(false); // dropdown open/close state



    // Fetch claim history whenever the selected user changes
    useEffect(() => {
    if (selectedUserForHistory) {
      fetchClaimHistory(selectedUserForHistory);
    } else {
      fetchRecentClaims();
    }
  }, [selectedUserForHistory]);


    // Fetch all claims made by the selected user
    const fetchClaimHistory = async (userId) => {
    try {
      setLoading(true);
      const data = await userService.getClaimHistory(userId);
      setClaimHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      onMessage("Error fetching claim history: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

    // Fetch last 5 global claim actions (if no user is selected)
    const fetchRecentClaims = async () => {
    try {
      setLoading(true);
      const data = await userService.getRecentClaims();
      setClaimHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      onMessage("Error fetching recent claims: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

    // Handle selecting a user from the dropdown
    const handleUserSelect = (userId) => {
    setSelectedUserForHistory(userId);
    setIsOpen(false);
  };

    // Format timestamp into readable date and time
    const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const selectedUser = users.find((u) => u._id === selectedUserForHistory);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <Clock size={24} />
          Claim History
          {selectedUser && (
            <span className="text-sm font-normal text-gray-500">
              - {selectedUser.name}
            </span>
          )}
        </h2>
        <button
          onClick={() =>
            selectedUserForHistory
              ? fetchClaimHistory(selectedUserForHistory)
              : fetchRecentClaims()
          }
          className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Filter size={16} />
          <label className="text-sm font-medium text-gray-700">
            Filter by User
          </label>
        </div>

        <div className="relative max-w-sm">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          >
            {selectedUser
              ? `${selectedUser.name} (${selectedUser.totalPoints} pts)`
              : "➖ No user selected"}
          </button>

          {isOpen && (
            <div className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
              <div
                onClick={() => handleUserSelect("")}
                className="px-4 py-2 text-gray-500 hover:bg-blue-100 cursor-pointer"
              >
                ➖ No user selected
              </div>

              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleUserSelect(user._id)}
                  className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${
                    user._id === selectedUserForHistory
                      ? "bg-blue-50 font-medium"
                      : ""
                  }`}
                >
                  {user.name} ({user.totalPoints} pts)
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* History List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      ) : claimHistory.length === 0 ? (
        <div className="text-center py-8">
          <Clock className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No claim history found</p>
          <p className="text-sm text-gray-400">
            {selectedUserForHistory
              ? "This user hasn't claimed any points yet"
              : "No users have claimed points yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-500 text-right mb-2">
            Showing{" "}
            {selectedUser
              ? "all claims for " + selectedUser.name
              : "most recent 5 claims globally"}
          </p>
          {claimHistory.map((claim, index) => {
            const { date, time } = formatDate(claim.claimedAt);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {(claim.userName || "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 flex items-center gap-2">
                      <User size={14} />
                      {claim.userName || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Calendar size={14} />
                      {date} at {time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-600">
                    +{claim.points}
                  </p>
                  <p className="text-sm text-gray-500">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ClaimHistory;
