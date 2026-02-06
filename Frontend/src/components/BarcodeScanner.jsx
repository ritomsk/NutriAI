import React, { useState } from 'react';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Scan, X } from 'lucide-react';

const BarcodeScanner = ({ onScanSuccess }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState(null);

    const handleScan = (err, result) => {
        if (err) {
            return;
        }
        if (result) {
            setIsScanning(false);
            onScanSuccess(result.text);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto my-4">

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

            {isScanning && (
                <div className="relative overflow-hidden bg-black border-2 border-blue-500 rounded-xl">

                    <button
                        onClick={() => setIsScanning(false)}
                        className="absolute z-10 p-2 text-white bg-black/50 rounded-full top-2 right-2 hover:bg-black/70"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <BarcodeScannerComponent
                        width={500}
                        height={500}
                        onUpdate={handleScan}
                        onError={(err) => setError("Camera access denied or not supported.")}
                        className="object-cover w-full h-64 sm:h-80"
                    />

                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute w-3/4 h-64 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-500/50 top-1/2 left-1/2 rounded-lg"></div>
                        <p className="absolute w-full text-sm font-medium text-center text-white bottom-4">
                            Point camera at barcode
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-2 text-sm text-center text-red-500">{error}</p>
            )}
        </div>
    );
};

export default BarcodeScanner;