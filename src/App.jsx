import { useEffect, useState } from 'react';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getFirestore, getAuth } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirebaseConfig } from './firebaseConfig';

const firebaseApp = initializeApp(getFirebaseConfig());
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

const App = () => {
  const [points, setPoints] = useState(0);
  const [userId, setUserId] = useState(null);
  const [adError, setAdError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    window.Telegram.WebApp.ready();

    // Initialize anonymous authentication
    auth.signInAnonymously().then((user) => {
      setUserId(user.user.uid);
      const userDoc = doc(db, 'users', user.user.uid);
      onSnapshot(userDoc, (doc) => {
        if (doc.exists()) setPoints(doc.data().points || 0);
      });
    }).catch((error) => {
      console.error('Firebase auth error:', error);
      setAdError('Failed to initialize authentication');
    });

    // Initialize Monetag
    const script = document.createElement('script');
    script.src = 'https://monetag.com/some-script.js?zone=9244919'; // Replace with actual Monetag script URL
    script.async = true;
    script.onload = () => {
      console.log('Monetag script loaded');
      
      // Initialize Monetag
      if (window.Monetag && typeof window.Monetag.init === 'function') {
        window.Monetag.init();
      }
      
      // Set up ad complete handler
      if (window.Monetag && typeof window.Monetag.onAdComplete === 'function') {
        window.Monetag.onAdComplete = async () => {
          console.log('Ad completed');
          try {
            await updateDoc(doc(db, 'users', userId), { points: points + 1 });
            setPoints(points + 1);
            setAdError(null);
          } catch (error) {
            console.error('Failed to update points:', error);
            setAdError('Failed to update points after watching ad');
          }
        };
      }

      // Set up ad error handler
      if (window.Monetag && typeof window.Monetag.onError === 'function') {
        window.Monetag.onError = (error) => {
          console.error('Monetag error:', error);
          setAdError('Failed to load ad. Please try again.');
        };
      }

      // Set up ad close handler
      if (window.Monetag && typeof window.Monetag.onAdClose === 'function') {
        window.Monetag.onAdClose = () => {
          console.log('Ad closed');
        };
      }
    };

    script.onerror = () => {
      console.error('Failed to load Monetag script');
      setAdError('Failed to load Monetag script. Please try again.');
    };
    document.body.appendChild(script);

    return () => {
      script.remove();
      if (window.Monetag && typeof window.Monetag.destroy === 'function') {
        window.Monetag.destroy();
      }
    };
  }, [userId, points]);

  const updatePoints = async (userId, newPoints) => {
    if (userId) {
      try {
        await updateDoc(doc(db, 'users', userId), { points: newPoints });
        setPoints(newPoints);
      } catch (error) {
        console.error('Failed to update points:', error);
        setAdError('Failed to update points');
      }
    }
  };

  const handleWatchAd = () => {
    setAdError(null);
    try {
      // Initialize ad if not already initialized
      if (window.Monetag && typeof window.Monetag.isInitialized === 'function' && !window.Monetag.isInitialized()) {
        if (typeof window.Monetag.init === 'function') {
          window.Monetag.init();
        }
      }
      
      // Show ad
      if (window.Monetag && typeof window.Monetag.showAd === 'function') {
        window.Monetag.showAd();
      }
    } catch (error) {
      console.error('Ad error:', error);
      setAdError('Failed to show ad. Please try again.');
    }
  };

  const MIN_WITHDRAWAL = 20000;

  const handleWithdraw = () => {
    if (points >= MIN_WITHDRAWAL) {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Reward Points App</h1>
      <p className="text-lg mb-4">Your Points: {points} (IDR {points})</p>
      {adError && <p className="text-red-500 mb-2">{adError}</p>}
      <button
        onClick={handleWatchAd}
        className="bg-blue-500 text-white p-2 rounded mr-4"
      >
        Watch Ad
      </button>
      <button
        onClick={handleWithdraw}
        className={`mt-4 px-4 py-2 rounded text-white ${
          points >= MIN_WITHDRAWAL ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'
        }`}
        disabled={points < MIN_WITHDRAWAL}
      >
        Request Withdrawal
      </button>
      {points < MIN_WITHDRAWAL && (
        <p className="text-red-500 mt-2">Minimum withdrawal is 20,000 points.</p>
      )}
      {/* Logika penarikan tetap sama */}
    </div>
  );
};

export default App;