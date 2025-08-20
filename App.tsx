
import React, { useState, useCallback } from 'react';
import type { GameState, Character } from './types';
import { generateFullCharacter } from './services/geminiService';
import CameraView from './components/CameraView';
import LoadingView from './components/LoadingView';
import CharacterSheet from './components/CharacterSheet';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('CAMERA');
    const [character, setCharacter] = useState<Character | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCharacterGeneration = useCallback(async (imageBase64: string) => {
        setGameState('GENERATING');
        setError(null);
        try {
            const newCharacter = await generateFullCharacter(imageBase64);
            setCharacter(newCharacter);
            setGameState('DISPLAY');
        } catch (e) {
            console.error(e);
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setError(errorMessage);
            setGameState('ERROR');
        }
    }, []);

    const handleReset = () => {
        setGameState('CAMERA');
        setCharacter(null);
        setError(null);
    };

    const renderContent = () => {
        switch (gameState) {
            case 'CAMERA':
                return <CameraView onCapture={handleCharacterGeneration} />;
            case 'GENERATING':
                return <LoadingView />;
            case 'DISPLAY':
                return character ? <CharacterSheet character={character} onGenerateAgain={handleReset} /> : null;
            case 'ERROR':
                return (
                    <div className="text-center p-8 bg-slate-800 rounded-lg shadow-xl">
                        <h2 className="text-2xl font-cinzel text-red-400 mb-4">An Error Occurred</h2>
                        <p className="text-slate-300 mb-6">{error}</p>
                        <button
                            onClick={handleReset}
                            className="bg-amber-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-700 transition-colors duration-300 text-lg shadow-md"
                        >
                            Try Again
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen w-full bg-slate-900 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(252,211,77,0.1),rgba(255,255,255,0))] flex flex-col items-center justify-center p-4">
            <header className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-amber-300 tracking-wider font-cinzel">D&D Character Forge</h1>
                <p className="text-slate-400 mt-2 text-lg">Create Your Legend, Powered by AI</p>
            </header>
            <div className="w-full max-w-4xl mx-auto">
                {renderContent()}
            </div>
             <footer className="text-center mt-8 text-slate-500 text-sm">
                <p>Character generation by Google Gemini & Imagen. All rights reserved.</p>
            </footer>
        </main>
    );
};

export default App;
