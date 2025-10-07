import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';

interface IconGeneratorFormProps {
  onSubmit: (data: { prompt: string; imageFile: File | null; logoFile: File | null; colors: string }) => void;
  isLoading: boolean;
}

const ImageUploader: React.FC<{
    title: string;
    description: string;
    imageFile: File | null;
    imagePreview: string | null;
    onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: DragEvent<HTMLDivElement>) => void;
    onClear: () => void;
    isLoading: boolean;
}> = ({ title, description, imageFile, imagePreview, onFileChange, onDrop, onClear, isLoading }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    return (
        <div className="flex-1">
            <label className="block text-sm font-medium text-slate-300 mb-2 text-left">{title}</label>
            <div 
                className="w-full p-4 h-48 border-2 border-dashed border-slate-600 rounded-lg text-center cursor-pointer hover:border-green-400 transition-colors flex flex-col justify-center items-center"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
            >
                <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                    disabled={isLoading}
                />
                {imagePreview ? (
                    <div className="relative group w-full h-full flex items-center justify-center">
                        <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
                        <button 
                            type="button" 
                            onClick={(e) => { e.stopPropagation(); onClear(); }} 
                            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm">Drag & drop or click to select</p>
                        <p className="text-xs text-slate-500">{description}</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export const IconGeneratorForm: React.FC<IconGeneratorFormProps> = ({ onSubmit, isLoading }) => {
  const [mode, setMode] = useState<'text' | 'image'>('text');
  const [prompt, setPrompt] = useState<string>('');
  const [colors, setColors] = useState<string>('');

  // State for reference image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // State for logo image
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleFileChange = (setter: (file: File | null) => void, previewSetter: (url: string | null) => void) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(file);
      const reader = new FileReader();
      reader.onloadend = () => previewSetter(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (setter: (file: File | null) => void, previewSetter: (url: string | null) => void) => (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/webp')) {
        setter(file);
        const reader = new FileReader();
        reader.onloadend = () => previewSetter(reader.result as string);
        reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const clearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      const submissionData = {
          prompt: prompt.trim(),
          imageFile: imageFile,
          logoFile: mode === 'image' ? logoFile : null,
          colors
      };
      onSubmit(submissionData);
    }
  };

  const handleModeChange = (newMode: 'text' | 'image') => {
    if (mode !== newMode) {
      setMode(newMode);
      setPrompt('');
      setColors('');
      clearImage();
      clearLogo();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="flex justify-center">
            <div className="bg-gray-800 rounded-full p-1 flex space-x-1">
                <button
                type="button"
                onClick={() => handleModeChange('text')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    mode === 'text'
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                    : 'text-slate-400 hover:bg-gray-700'
                }`}
                >
                Text Description
                </button>
                <button
                type="button"
                onClick={() => handleModeChange('image')}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    mode === 'image'
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                    : 'text-slate-400 hover:bg-gray-700'
                }`}
                >
                Edit Image
                </button>
            </div>
        </div>

      {mode === 'text' && (
        <div className="animate-fade-in flex flex-col md:flex-row gap-4 justify-center">
            <div className='w-full md:w-1/2'>
                <ImageUploader 
                    title="Reference Image (Optional)"
                    description="Influences the generated style"
                    imageFile={imageFile}
                    imagePreview={imagePreview}
                    onFileChange={handleFileChange(setImageFile, setImagePreview)}
                    onDrop={handleDrop(setImageFile, setImagePreview)}
                    onClear={clearImage}
                    isLoading={isLoading}
                />
            </div>
        </div>
      )}

      {mode === 'image' && (
        <div className="animate-fade-in flex flex-col md:flex-row gap-4">
           <ImageUploader 
            title="Reference Image"
            description="(Required for editing)"
            imageFile={imageFile}
            imagePreview={imagePreview}
            onFileChange={handleFileChange(setImageFile, setImagePreview)}
            onDrop={handleDrop(setImageFile, setImagePreview)}
            onClear={clearImage}
            isLoading={isLoading}
           />
           <ImageUploader 
            title="Logo Image"
            description="(Optional)"
            imageFile={logoFile}
            imagePreview={logoPreview}
            onFileChange={handleFileChange(setLogoFile, setLogoPreview)}
            onDrop={handleDrop(setLogoFile, setLogoPreview)}
            onClear={clearLogo}
            isLoading={isLoading}
           />
        </div>
      )}

      <div>
        <label htmlFor="colors" className="block text-sm font-medium text-slate-300 mb-2 text-left">
          Custom Colors (optional, comma-separated)
        </label>
        <input
          id="colors"
          type="text"
          value={colors}
          onChange={(e) => setColors(e.target.value)}
          placeholder="e.g., gold, navy blue, white"
          disabled={isLoading}
          className="w-full p-3 bg-gray-800 border border-slate-600 rounded-lg focus:ring-1 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-colors duration-300 text-gray-200 placeholder-gray-500"
        />
      </div>

      <div className="relative">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'text' ? 'A 3D icon of a smiling robot head...' : 'Combine the images, make the background transparent...'}
          disabled={isLoading}
          required
          className="w-full p-4 pr-32 text-lg bg-gray-800 border-2 border-slate-600 rounded-full focus:ring-2 focus:ring-green-400 focus:border-green-400 focus:outline-none transition-colors duration-300 text-gray-200 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim() || (mode === 'image' && !imageFile)}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 px-6 py-2.5 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-teal-500 rounded-full hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </form>
  );
};