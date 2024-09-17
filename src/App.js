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
      setMessage('Fetching data... Please wait.');

      NProgress.start();

      const response = await axios.post(
        'http://localhost:5000/api/download',
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-pink-500 p-4">
      <h1 className="text-6xl font-extrabold text-white mb-8 drop-shadow-lg tracking-wider">
        Download Media
      </h1>
      <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg shadow-2xl rounded-lg p-8 transform transition-transform duration-300 hover:scale-105 border border-white border-opacity-30">
        <div className="mb-6">
          <select
            className="w-full p-3 bg-white bg-opacity-40 border border-gray-300 rounded-lg text-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-200"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option value="" className="text-gray-500">Select Platform</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
          </select>
        </div>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Enter URL"
            className="w-full p-3 bg-white bg-opacity-40 border border-gray-300 rounded-lg text-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-300 transition duration-200 placeholder-gray-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button
          className={`w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'
          }`}
          onClick={handleDownload}
          disabled={isLoading || !platform || !url}
        >
          {isLoading ? 'Downloading...' : 'Download'}
        </button>

        {message && (
          <p className="text-center mt-4 text-lg text-white font-medium">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
