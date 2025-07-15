import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { userService } from '../services/api';
import { toast } from 'react-toastify'; 

const AddUser = ({ onUserAdded, loading }) => {
  // Track the input value for new user name
  const [newUserName, setNewUserName] = useState('');

  // Toggle form visibility
  const [showForm, setShowForm] = useState(false);

  // Handle adding a user via API 
  const handleAddUser = async () => {
    if (!newUserName.trim()) return;

    try {
      const res = await userService.addUser(newUserName.trim());

      if (res && res._id) {
        toast.success(`✅ "${newUserName}" added successfully!`);
        onUserAdded(); // to reload the user list
        setNewUserName('');
        setShowForm(false);
      } else {
        toast.error("❌ Failed to add user.");
      }
    } catch (err) {
      toast.error("🚫 Something went wrong. Try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Plus size={20} /> Add User
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          {showForm ? 'Cancel' : 'Add New'}
        </button>
      </div>

      {showForm && (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Enter user name"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddUser}
            disabled={loading || !newUserName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
