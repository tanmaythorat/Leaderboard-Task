import React, { useState } from "react";
import { Users } from "lucide-react";

const UserSelect = ({ users, selectedUserId, onUserSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedUser = users.find((u) => u._id === selectedUserId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Users size={20} />
        Select User
      </h2>

      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose a user to claim points for
        </label>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {selectedUser
            ? `${selectedUser.name} (${selectedUser.totalPoints} pts)`
            : "➖ No user selected"}
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-1 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
            <div
              onClick={() => {
                onUserSelect('');
                setIsOpen(false);
              }}
              className="px-4 py-2 text-gray-500 hover:bg-blue-100 cursor-pointer"
            >
              ➖ No user selected
            </div>

            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => {
                  onUserSelect(user._id);
                  setIsOpen(false);
                }}
                className={`px-4 py-2 hover:bg-blue-100 cursor-pointer ${
                  user._id === selectedUserId ? "bg-blue-50 font-medium" : ""
                }`}
              >
                {user.name} ({user.totalPoints} pts)
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserSelect;
