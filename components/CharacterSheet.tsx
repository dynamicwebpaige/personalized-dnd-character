
import React from 'react';
import type { Character } from '../types';
import StatDisplay from './StatDisplay';

interface CharacterSheetProps {
    character: Character;
    onGenerateAgain: () => void;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character, onGenerateAgain }) => {
    return (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="md:col-span-1 flex flex-col items-center">
                    <div className="w-full aspect-[3/4] rounded-lg overflow-hidden border-2 border-amber-800/50 shadow-lg mb-4">
                        <img src={character.characterImage} alt={character.name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="text-3xl font-cinzel text-amber-300 text-center">{character.name}</h2>
                    <p className="text-slate-400 text-lg text-center">{character.race} {character.class}</p>
                </div>
                
                <div className="md:col-span-2">
                    <div className="mb-6">
                        <h3 className="text-2xl font-cinzel text-amber-400 border-b-2 border-amber-800/50 pb-2 mb-3">Backstory</h3>
                        <p className="text-slate-300 leading-relaxed">{character.backstory}</p>
                    </div>

                    <div>
                        <h3 className="text-2xl font-cinzel text-amber-400 border-b-2 border-amber-800/50 pb-2 mb-4">Attributes</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <StatDisplay name="Strength" value={character.stats.strength} />
                            <StatDisplay name="Dexterity" value={character.stats.dexterity} />
                            <StatDisplay name="Constitution" value={character.stats.constitution} />
                            <StatDisplay name="Intelligence" value={character.stats.intelligence} />
                            <StatDisplay name="Wisdom" value={character.stats.wisdom} />
                            <StatDisplay name="Charisma" value={character.stats.charisma} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mt-8">
                <button
                    onClick={onGenerateAgain}
                    className="bg-amber-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-amber-700 transition-all duration-300 text-lg shadow-md transform hover:scale-105"
                >
                    Forge a New Hero
                </button>
            </div>
        </div>
    );
};

export default CharacterSheet;
