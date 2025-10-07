
import React from 'react';

export const Header: React.FC = () => (
    <header className="py-6">
        <div className="container mx-auto px-4 text-center">
             <div className="flex items-center justify-center space-x-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                <h1 className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                    Icon Genie
                </h1>
            </div>
            <p className="mt-2 text-lg text-slate-400">Your personal AI-powered icon and logo generator.</p>
        </div>
    </header>
);
