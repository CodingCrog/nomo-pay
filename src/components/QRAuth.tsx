import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useSocketNonce } from '../../node_modules/nsw-frontend-core-lib/dist/index.js';
import { MdOutlineContentCopy } from 'react-icons/md';

export const QRAuth: React.FC = () => {
  const nonce = useSocketNonce();
  
  if (!nonce) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing authentication...</p>
        </div>
      </div>
    );
  }

  const qr_backend_url = import.meta.env.VITE_QR_BACKEND_URL ?? import.meta.env.VITE_BACKEND_URL;
  const is_https = qr_backend_url?.includes('https://');
  const backend_base_url = qr_backend_url?.includes('https://') 
    ? qr_backend_url.split('https://')?.[1] 
    : qr_backend_url?.includes('http://') 
      ? qr_backend_url.split('http://')?.[1] 
      : qr_backend_url;
  
  const url = `${is_https ? 'https' : 'http'}://nomo.id/${backend_base_url}/backend/qrae?n=${nonce}&r=/backend/qrlae&tETH=1&orgn=${window.location.host}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    alert('Copied to clipboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Scan the QR code with your Nomo app to connect
          </p>
          
          <div className="bg-black p-4 rounded-lg inline-block mb-6">
            <QRCodeSVG
              value={url}
              fgColor="#fff"
              bgColor="#000"
              size={200}
            />
          </div>
          
          <button
            onClick={handleCopy}
            className="flex items-center justify-center mx-auto mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdOutlineContentCopy className="mr-2" />
            Copy Link
          </button>
          
          <div className="border-t pt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Don't have the Nomo app?
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://apps.apple.com/app/nomo-powered-by-zeniq/id1660767200"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Download for iOS
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=app.nomo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                Download for Android
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};