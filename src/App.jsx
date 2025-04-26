import { useEffect, useState } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';

const App = () => {
  const [points, setPoints] = useState(0);
  const [userId, setUserId] = useState(null);
  const [adError, setAdError] = useState(null);

  useEffect(() => {
    window.Telegram.WebApp.ready();

    // Inisialisasi autentikasi anonim
    auth.signInAnonymously().then((user) => {
      setUserId(user.user.uid);
      const userDoc = doc(db, 'users', user.user.uid);
      onSnapshot(userDoc, (doc) => {
        if (doc.exists()) setPoints(doc.data().points || 0);
      });
    });

    // Inisialisasi Monetag
    const script = document.createElement('script');
    script.src = 'https://monetag.com/some-script.js?zone=9244919';
    script.async = true;
    script.onload = () => {
      console.log('Monetag script loaded');
      window.Monetag?.onAdComplete = () => {
        console.log('Ad completed');
        updatePoints(userId, points + 1);
      };
    };
    script.onerror = () => {
      setAdError('Gagal memuat skrip Monetag');
    };
    document.body.appendChild(script);

    return () => script.remove();
  }, [userId, points]);

  const updatePoints = async (userId, newPoints) => {
    if (userId) {
      await updateDoc(doc(db, 'users', userId), { points: newPoints });
    }
  };

  const handleWatchAd = () => {
    setAdError(null);
    try {
      window.Monetag?.showAd();
    } catch (e) {
      setAdError('Gagal menampilkan iklan: ' + e.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl">Reward Points App</h1>
      <p>Points: {points}</p>
      {adError && <p className="text-red-500">{adError}</p>}
      <button
        onClick={handleWatchAd}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Watch Ad
      </button>
      {/* Logika penarikan tetap sama */}
    </div>
  );
};

export default App;