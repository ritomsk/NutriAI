import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Scan, X } from 'lucide-react'; // Assuming you have lucide-react installed

const BarcodeScanner = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = (err, result) => {
        if (err) {
            // Common to get minor errors while frames are processing, usually ignore them
            return;
        }
        if (result) {
            setIsScanning(false); // Stop the camera immediately
            onScanSuccess(result.text); // Send the raw barcode number up to the parent
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-4">

            {/* 1. Idle State: Show "Start Scan" Button */}
            {!isScanning && (
                <button
                    onClick={() => {
                        setError(null);
                        setIsScanning(true);
                    }}
                    className="flex items-center justify-center w-full gap-2 p-4 text-blue-600 transition border-2 border-blue-100 bg-blue-50 rounded-xl hover:bg-blue-100"
                >
                    <Scan className="w-5 h-5" />
                    <span className="font-medium">Scan Barcode</span>
                </button>
            )}

            {/* 2. Scanning State: Show Camera + "Stop" Button */}
            {isScanning && (
                <div className="relative overflow-hidden bg-black border-2 border-blue-500 rounded-xl">

                    {/* Close Button */}
                    <button
                        onClick={() => setIsScanning(false)}
                        className="absolute z-10 p-2 text-white bg-black/50 rounded-full top-2 right-2 hover:bg-black/70"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* The Scanner */}
                    <BarcodeScannerComponent
                        width={500}
                        height={500}
                        onUpdate={handleScan}
                        onError={(err) => setError("Camera access denied or not supported.")}
                        // torch={true} // Uncomment if you want to try enabling flash (browser dependent)
                        className="object-cover w-full h-64 sm:h-80"
                    />

                    {/* Visual Guide Overlay (The Red Line) */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute w-3/4 h-64 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-500/50 top-1/2 left-1/2 rounded-lg"></div>
                        <p className="absolute w-full text-sm font-medium text-center text-white bottom-4">
                            Point camera at barcode
                        </p>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-2 text-sm text-center text-red-500">{error}</p>
            )}
        </div>
    );
};

export default BarcodeScanner;