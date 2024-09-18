import React, { useState } from 'react';
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; 

function App() {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Log the backend URL to verify it's being read correctly
  console.log('Backend URL:', process.env.REACT_APP_BACKEND_URL);

  const handleDownload = async () => {
    if (!platform || !url) return;

    try {
      setIsLoading(true);
      setMessage('Fetching details... Please wait.');

      NProgress.start();

      const backendUrl = process.env.REACT_APP_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/download`,
        { platform, url },
        { responseType: 'blob' }
      );

      const fileName = 'media.mp4';
      const blob = new Blob([response.data], { type: 'video/mp4' });

      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage('Download completed!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to download. Please try again.');
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 via-purple-800 to-pink-700 p-6">
      {/* Main Heading */}
      <h1 className="text-3xl sm:text-6xl font-extrabold text-white mb-2 drop-shadow-lg tracking-wide text-center">
        Instant Video Downloader
      </h1>

      {/* Page Description */}
      <p className="text-md sm:text-lg text-gray-200 mb-8 text-center tracking-wide">
        Easily download videos from Instagram, YouTube, and Twitter in just a few clicks!
      </p>

      <div className="w-full max-w-lg bg-white bg-opacity-5 backdrop-blur-xl shadow-2xl rounded-lg p-10 border border-gray-200">
        <div className="mb-6">
          <select
            className="w-full p-4 bg-black bg-opacity-60 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-200"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="" className="text-gray-400">Select Platform</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Paste video link here"
            className="w-full p-4 bg-black bg-opacity-60 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-200"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button
          className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-transform transform-gpu duration-300 ease-in-out hover:scale-105 active:scale-95 active:shadow-inner ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleDownload}
          disabled={isLoading || !platform || !url}
        >
          {isLoading ? 'Downloading...' : 'Download'}
        </button>

        {/* Fetching message and progress bar */}
        {message && (
          <>
            <p className={`mt-6 text-center text-lg font-semibold ${
              message.includes('completed') ? 'text-green-400' : 'text-red-400'
            }`}>
              {message}
            </p>

            {/* Progress Bar */}
            {isLoading && (
              <div className="w-full mt-4">
                <div className="relative h-2 bg-gray-300 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-pink-500 rounded-full animate-pulse"
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
