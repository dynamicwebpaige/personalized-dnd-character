
import React, { useState, useEffect } from 'react';

const loadingMessages = [
    "Consulting the arcane oracles...",
    "Forging your hero's destiny...",
    "Rolling the dice of fate...",
    "Sketching the hero's portrait...",
    "Inscribing the ancient scrolls...",
    "Gathering whispers from the ether...",
    "Polishing the final details..."
];

const LoadingView: React.FC = () => {
    const [message, setMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prevMessage => {
                const currentIndex = loadingMessages.indexOf(prevMessage);
                const nextIndex = (currentIndex + 1) % loadingMessages.length;
                return loadingMessages[nextIndex];
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl text-center min-h-[400px]">
            <div className="w-16 h-16 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-cinzel text-amber-300 mb-2">Generating Character</h2>
            <p className="text-slate-400 transition-opacity duration-500">{message}</p>
        </div>
    );
};

export default LoadingView;
