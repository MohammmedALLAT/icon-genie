import React from 'react';
import { Spinner } from './Spinner';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const Placeholder: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-slate-500">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-medium">Your icon will appear here</h3>
        <p className="text-slate-400">Enter a description above to get started.</p>
    </div>
);


export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading }) => {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-4">
        <div className="w-full aspect-square bg-gray-800/50 rounded-2xl border-2 border-dashed border-slate-700 flex items-center justify-center p-4 transition-all duration-300">
        {isLoading && <Spinner />}
        {!isLoading && imageUrl && (
            <img
            src={imageUrl}
            alt="Generated icon"
            className="object-contain w-full h-full rounded-lg animate-fade-in"
            />
        )}
        {!isLoading && !imageUrl && <Placeholder />}
        </div>
        {!isLoading && imageUrl && (
        <a
            href={imageUrl}
            download="generated-icon.png"
            className="inline-flex items-center justify-center px-6 py-2.5 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-full hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 animate-fade-in"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
        </a>
        )}
    </div>
  );
};