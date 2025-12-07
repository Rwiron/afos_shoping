import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '../types';
import { MENU_ITEMS } from '../constants';

interface ScannerProps {
  onScan: (item: MenuItem) => void;
  onClose: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScan, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied or not available", err);
      }
    };
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleSimulateScan = () => {
    const randomItem = MENU_ITEMS[Math.floor(Math.random() * MENU_ITEMS.length)];
    onScan(randomItem);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      <div className="absolute top-6 right-6 z-20">
        <button onClick={onClose} className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-3 rounded-full transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-gray-900">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        
        <div className="relative w-64 h-64 z-20">
           <div className="absolute inset-0 border border-white/30 rounded-3xl"></div>
           <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#1f2937] rounded-tl-3xl"></div>
           <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#1f2937] rounded-tr-3xl"></div>
           <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#1f2937] rounded-bl-3xl"></div>
           <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#1f2937] rounded-br-3xl"></div>
           
           <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-[#1f2937] shadow-[0_0_15px_#1f2937] animate-pulse"></div>
        </div>

        <div className="absolute bottom-20 z-20 flex flex-col items-center gap-4">
           <p className="text-white/80 text-sm font-medium">Scan product barcode</p>
           <button 
             onClick={handleSimulateScan}
             className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold shadow-xl hover:scale-105 transition-transform"
           >
              Simulate Scan
           </button>
        </div>
      </div>
    </div>
  );
};

export default Scanner;