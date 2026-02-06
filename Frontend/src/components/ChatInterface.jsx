import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam'; // <--- NEW IMPORT
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Sparkles, X, FileImage, ScanLine, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import AnalysisLoader from './AnalysisLoader';
import ResultsView from './ResultsView';
import BarcodeScanner from './BarcodeScanner';

// Helper: Convert Webcam Base64 to a real File object
const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};

const ChatInterface = () => {
    // State Management
    const [mode, setMode] = useState('input'); // input | scanning | camera | loading | results
    const [inputValue, setInputValue] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [apiResponse, setApiResponse] = useState(null);
    const [error, setError] = useState(null);

    // Camera Refs & State
    const webcamRef = useRef(null);
    const fileInputRef = useRef(null);
    const [facingMode, setFacingMode] = useState("environment"); // "user" (front) or "environment" (back)

    // --- 1. BARCODE LOGIC (Kept same as before) ---
    const handleBarcodeScanned = async (barcode) => {
        setMode('loading');
        setError(null);
        try {
            console.log("Checking Database for:", barcode);
            const offResponse = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
            const offData = await offResponse.json();

            if (offData.status === 1) {
                const product = offData.product;
                const payload = {
                    product_name: product.product_name,
                    ingredients_text: product.ingredients_text,
                    nutriments: product.nutriments,
                    image_url: product.image_front_url,
                    userGoals: inputValue || "General health check"
                };

                const backendResponse = await fetch('http://localhost:3001/api/barcode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!backendResponse.ok) throw new Error("AI Processing failed");
                const data = await backendResponse.json();

                const normalizedData = {
                    ...data.analysis,
                    product_data: data.product_details
                };
                setApiResponse(normalizedData);
                setMode('results');
            } else {
                setError("Product not found. Please take a photo instead.");
                setMode('input');
            }
        } catch (err) {
            console.error("Barcode flow failed:", err);
            setError("Could not fetch product data. Please try uploading a photo.");
            setMode('input');
        }
    };

    // --- 2. CAMERA LOGIC (NEW) ---
    const capturePhoto = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
            // Convert Base64 -> File Object
            const file = dataURLtoFile(imageSrc, "camera_capture.jpg");

            // Update State (Just like a normal upload)
            setSelectedImage(file);
            setPreviewUrl(imageSrc);

            // Close camera and go back to input
            setMode('input');
        }
    }, [webcamRef]);

    const toggleCamera = () => {
        setFacingMode(prev => prev === "user" ? "environment" : "user");
    };

    // --- 3. EXISTING HANDLERS ---
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const clearFile = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleAnalyze = async () => {
        if (!inputValue.trim() && !selectedImage) return;

        setMode('loading');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('userGoals', inputValue);
            if (selectedImage) {
                // 'productImage' matches the Multer config in server.js
                formData.append('image', selectedImage);
            }

            const response = await fetch('http://localhost:3001/api/analyze', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error(`Server error: ${response.status}`);

            const data = await response.json();
            setApiResponse(data);
            setMode('results');

        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Failed to analyze ingredients. Please try again.");
            setMode('input');
        }
    };

    const handleReset = () => {
        setInputValue('');
        clearFile();
        setApiResponse(null);
        setMode('input');
    };

    return (
        <div className="w-full md:max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
            <AnimatePresence mode="wait">

                {/* --- MODE: INPUT --- */}
                {mode === 'input' && (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="w-full space-y-8"
                    >
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                                What are we eating today?
                            </h2>
                            <p className="text-text-body">
                                Paste ingredients, scan a barcode, or snap a photo.
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm text-center border border-red-100 shadow-sm animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="glass p-4 rounded-3xl shadow-glass space-y-4 relative transition-all focus-within:ring-2 focus-within:ring-mesh-lavender/50">
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />

                            {previewUrl && (
                                <div className="relative w-full h-48 bg-gray-50 rounded-xl overflow-hidden mb-4 border border-border-glass">
                                    <img
                                        src={previewUrl}
                                        alt="Label Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={clearFile}
                                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-1 rounded-full transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <textarea
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={selectedImage ? "Add context about this photo..." : "Paste ingredients or type your health goals..."}
                                className="w-full min-h-[120px] bg-transparent border-none resize-none focus:ring-0 text-lg text-text-primary placeholder:text-text-muted p-2 font-serif leading-relaxed"
                            />

                            <div className="flex items-center justify-between px-2 pt-2 border-t border-border-glass">
                                <div className="flex items-center gap-2">
                                    {/* 1. UPLOAD BUTTON */}
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className={cn(
                                            "p-2 rounded-full transition-colors tooltip flex items-center gap-2",
                                            selectedImage ? "text-emerald-600 bg-emerald-50" : "text-text-body hover:bg-black/5"
                                        )}
                                        title="Upload Photo"
                                    >
                                        <Upload className="w-5 h-5" />
                                        {selectedImage && <span className="text-xs font-medium">Attached</span>}
                                    </button>

                                    {/* 2. CAMERA BUTTON (NEW) */}
                                    <button
                                        onClick={() => setMode('camera')}
                                        className="p-2 text-text-body hover:bg-black/5 rounded-full transition-colors tooltip flex items-center gap-2"
                                        title="Take Photo"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>

                                    {/* 3. BARCODE BUTTON */}
                                    <button
                                        onClick={() => setMode('scanning')}
                                        className="p-2 text-text-body hover:bg-blue-50 hover:text-blue-600 rounded-full transition-colors tooltip flex items-center gap-2"
                                        title="Scan Barcode"
                                    >
                                        <ScanLine className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="text-xs text-text-muted font-medium">
                                    {inputValue.length} chars
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={handleAnalyze}
                                disabled={!inputValue.trim() && !selectedImage}
                                className={cn(
                                    "group relative inline-flex items-center justify-center px-8 py-3.5 text-lg font-semibold text-white transition-all duration-300 rounded-full shadow-lg",
                                    (inputValue.trim() || selectedImage)
                                        ? "bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-glow-green hover:scale-105"
                                        : "bg-gray-300 cursor-not-allowed text-gray-400 shadow-none"
                                )}
                            >
                                <Sparkles className="w-5 h-5 mr-2" />
                                Analyze Ingredients
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* --- MODE: CAMERA (NEW) --- */}
                {mode === 'camera' && (
                    <motion.div
                        key="camera"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-[60vh] md:h-[500px] relative rounded-3xl overflow-hidden bg-black shadow-2xl"
                    >
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={{ facingMode: facingMode }}
                            className="w-full h-full object-cover"
                        />

                        {/* Camera Overlay Controls */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
                            <button
                                onClick={() => setMode('input')}
                                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <button
                                onClick={capturePhoto}
                                className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/20 transition-all"
                            >
                                <div className="w-12 h-12 bg-white rounded-full" />
                            </button>

                            <button
                                onClick={toggleCamera}
                                className="p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all"
                            >
                                <RefreshCcw className="w-6 h-6" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* --- MODE: SCANNING (Barcode) --- */}
                {mode === 'scanning' && (
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full flex flex-col items-center"
                    >
                        <BarcodeScanner
                            onScanSuccess={handleBarcodeScanned}
                        />
                        <button
                            onClick={() => setMode('input')}
                            className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-colors"
                        >
                            Cancel Scanning
                        </button>
                    </motion.div>
                )}

                {/* --- MODE: LOADING --- */}
                {mode === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full"
                    >
                        <AnalysisLoader />
                    </motion.div>
                )}

                {/* --- MODE: RESULTS --- */}
                {mode === 'results' && (
                    <motion.div
                        key="results"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="w-full"
                    >
                        <ResultsView results={apiResponse} onReset={handleReset} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatInterface;