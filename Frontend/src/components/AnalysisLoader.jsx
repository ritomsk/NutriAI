import React from 'react';
import { motion } from 'framer-motion';

const AnalysisLoader = () => {
    const loadingSteps = [
        "Parsing ingredients...",
        "Checking safety databases...",
        "Synthesizing summary...",
        "Finalizing analysis..."
    ];

    const [stepIndex, setStepIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setStepIndex((prev) => (prev + 1) % loadingSteps.length);
        }, 1200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 min-h-[400px]">
            <div className="relative w-32 h-32">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-emerald-500 rounded-full blur-xl animate-pulse" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 bg-rose-500 rounded-full blur-xl animate-pulse delay-150" />
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-violet-600 rounded-full blur-xl animate-pulse delay-300" />
                </motion.div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full shadow-lg z-10" />
                </div>
            </div>

            <div className="text-center space-y-2">
                <motion.h3
                    key={stepIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-xl font-bold text-slate-800"
                >
                    {loadingSteps[stepIndex]}
                </motion.h3>
                <p className="text-slate-500 font-medium text-sm">This AI analysis might take a few seconds.</p>
            </div>
        </div>
    );
};

export default AnalysisLoader;