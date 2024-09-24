import React, { useState } from 'react';
import axios from 'axios';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

function App() {
  const [platform, setPlatform] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleDownload = async () => {
    if (!platform || !url) return;

    try {
      setIsLoading(true);
      setMessage('Fetching details... Please wait.');
      NProgress.start();

      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

      const response = await axios.post(
        `${backendUrl}/api/download`,
        { platform, url },
        {
          responseType: 'blob', 
        }
      );

    
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `download_${platform}.mp4`;


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

      if (error.response && error.response.status === 400) {
        setMessage('Invalid URL or unsupported platform.');
      } else {
        setMessage('Failed to download. Please check the URL or try again later.');
      }
    } finally {
      setIsLoading(false);
      NProgress.done();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 p-6">
      <h1 className="text-4xl sm:text-6xl font-extrabold text-white mb-4 drop-shadow-lg tracking-wide text-center">
        Video Downloader
      </h1>
      <p className="text-md sm:text-lg text-gray-300 mb-8 text-center tracking-wide">
        Download videos from YouTube, Instagram, or Twitter in just a few clicks!
      </p>
      <div className="w-full max-w-xl bg-white bg-opacity-5 backdrop-blur-lg shadow-2xl rounded-lg p-8 border border-gray-700">
        <div className="mb-6">
          <select
            className="w-full p-4 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-4 focus:ring-pink-500 transition duration-200"
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
            placeholder={`Paste ${platform ? platform : 'video'} link here`}
            aria-label="Video URL input"
            className="w-full p-4 bg-gray-800 bg-opacity-80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-500 transition duration-200"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button
          className={`w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-transform transform-gpu duration-300 ease-in-out hover:scale-105 active:scale-95 active:shadow-inner ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleDownload}
          disabled={isLoading || !platform || !url}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
              Downloading...
            </div>
          ) : (
            'Download'
          )}
        </button>
        {message && (
          <p
            className={`mt-6 text-center text-lg font-semibold ${
              message.includes('completed') ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
