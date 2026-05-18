"use client";

import { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function Home() {
  const [inputType, setInputType] = useState('url'); // 'url' or 'text'
  const [inputValue, setInputValue] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Debounce generation for better UX
    const timer = setTimeout(() => {
      if (inputValue.trim()) {
        generateQR();
      } else {
        setQrCodeUrl('');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, inputType]);

  const generateQR = async () => {
    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(inputValue, {
        width: 300,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(url);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrCodeUrl) return;
    const a = document.createElement('a');
    a.href = qrCodeUrl;
    a.download = `my-qr-code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <main className="container">
      <div className="glass-card">
        <h1 className="title">QR Code Builder</h1>
        <p className="subtitle">Create your own custom QR codes instantly.</p>

        <div className="tabs">
          <div 
            className={`tab ${inputType === 'url' ? 'active' : ''}`}
            onClick={() => { setInputType('url'); setInputValue(''); }}
          >
            URL / Link
          </div>
          <div 
            className={`tab ${inputType === 'text' ? 'active' : ''}`}
            onClick={() => { setInputType('text'); setInputValue(''); }}
          >
            Plain Text
          </div>
        </div>

        <div className="input-group">
          <label htmlFor="qr-input">
            {inputType === 'url' ? 'Enter Website URL' : 'Enter Text'}
          </label>
          <input
            id="qr-input"
            type={inputType === 'url' ? 'url' : 'text'}
            className="input-field"
            placeholder={inputType === 'url' ? 'https://example.com' : 'Enter any text here...'}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {qrCodeUrl && (
          <div className="qr-preview-container">
            <div className="qr-image-wrapper">
              <img src={qrCodeUrl} alt="Generated QR Code" />
            </div>
            
            <button 
              className="btn" 
              onClick={downloadQR}
              disabled={isGenerating}
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>

      <footer>
        &copy; {new Date().getFullYear()} QR Code Builder. All rights reserved.
      </footer>
    </main>
  );
}
