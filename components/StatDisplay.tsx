
import React from 'react';

interface StatDisplayProps {
    name: string;
    value: number;
}

const StatDisplay: React.FC<StatDisplayProps> = ({ name, value }) => {
    const modifier = Math.floor((value - 10) / 2);
    const modifierSign = modifier >= 0 ? '+' : '';

    return (
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700 text-center shadow-inner">
            <div className="text-sm text-slate-400 uppercase tracking-wider">{name}</div>
            <div className="text-3xl font-bold text-amber-300 my-1">{value}</div>
            <div className="bg-slate-700 text-slate-200 rounded-full px-2 py-0.5 text-sm font-semibold">
                {modifierSign}{modifier}
            </div>
        </div>
    );
};

export default StatDisplay;
