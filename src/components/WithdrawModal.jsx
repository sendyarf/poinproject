import React, { useState } from 'react';
import { requestWithdrawal, addPoints } from '../firebase';

const WithdrawModal = ({ isOpen, onClose, userId, points, onPointsUpdated }) => {
  const [danaNumber, setDanaNumber] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!danaNumber || !/^\d{10,12}$/.test(danaNumber)) {
      setError('Please enter a valid DANA number (10-12 digits).');
      return;
    }
    try {
      await requestWithdrawal(userId, points, danaNumber);
      await addPoints(userId, -points); // Deduct points
      onPointsUpdated(0);
      alert('Withdrawal request submitted! Please wait for manual processing.');
      setDanaNumber('');
      onClose();
    } catch (err) {
      setError('Failed to submit request. Please try again.');
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Request Withdrawal</h2>
        <p className="mb-4">You have {points} points (IDR {points}). Enter your DANA number to withdraw.</p>
        <input
          type="text"
          value={danaNumber}
          onChange={(e) => setDanaNumber(e.target.value)}
          placeholder="Enter DANA number"
          className="w-full p-2 border rounded mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 text-black rounded mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleSubmit}
          >
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;