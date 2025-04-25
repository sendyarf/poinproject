import React, { useEffect } from 'react';
import { addPoints, getUserPoints } from '../firebase';

const AdButton = ({ userId, onPointsEarned }) => {
  useEffect(() => {
    if (window.show_9244919) return;
    const tag = document.createElement('script');
    tag.src = '//whephiwums.com/sdk.js';
    tag.dataset.zone = '9244919';
    tag.dataset.sdk = 'show_9244919';
    document.body.appendChild(tag);
  }, []);

  const showAd = () => {
    if (window.show_9244919) {
      window.show_9244919().then(async () => {
        await addPoints(userId, 1);
        const newPoints = await getUserPoints(userId);
        onPointsEarned(newPoints);
        alert('You earned 1 point!');
      }).catch((error) => {
        console.error('Ad failed to load:', error);
        alert('Failed to load ad. Please try again.');
      });
    } else {
      alert('Ad script not loaded yet. Please wait.');
    }
  };

  return (
    <button
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      onClick={showAd}
    >
      Watch Ad (+1 Point)
    </button>
  );
};

export default AdButton;