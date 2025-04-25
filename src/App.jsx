import React, { useState, useEffect } from 'react';
import AdButton from './components/AdButton';
import WithdrawModal from './components/WithdrawModal';
import { initializeUser, getUserPoints } from './firebase';

const App = () => {
  const [userId, setUserId] = useState(null);
  const [points, setPoints] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Initialize Telegram Web App
    window.Telegram.WebApp.ready();
    const init = async () => {
      const uid = await initializeUser();
      setUserId(uid);
      const userPoints = await getUserPoints(uid);
      setPoints(userPoints);
    };
    init();
  }, []);

  const handlePointsEarned = (newPoints) => {
    setPoints(newPoints);
  };

  const MIN_WITHDRAWAL = 20000;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Reward Points App</h1>
      <p className="text-lg mb-4">Your Points: {points} (IDR {points})</p>
      <AdButton userId={userId} onPointsEarned={handlePointsEarned} />
      <button
        className={`mt-4 px-4 py-2 rounded text-white ${points >= MIN_WITHDRAWAL ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'}`}
        onClick={() => points >= MIN_WITHDRAWAL && setIsModalOpen(true)}
        disabled={points < MIN_WITHDRAWAL}
      >
        Request Withdrawal
      </button>
      {points < MIN_WITHDRAWAL && (
        <p className="text-red-500 mt-2">Minimum withdrawal is 20,000 points.</p>
      )}
      <WithdrawModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userId={userId}
        points={points}
        onPointsUpdated={setPoints}
      />
    </div>
  );
};

export default App;