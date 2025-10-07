import React, { useState, useCallback } from 'react';
import { IconGeneratorForm } from './components/IconGeneratorForm';
import { ImageDisplay } from './components/ImageDisplay';
import { generateOrEditIcon } from './services/geminiService';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const fileToBase64 = (file: File): Promise<{ data: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve({ data: base64Data, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};


const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (data: { prompt: string; imageFile: File | null; logoFile: File | null, colors: string }) => {
    setIsLoading(true);
    setGeneratedImageUrl(null);
    setError(null);
    try {
      let imageData: { data: string, mimeType: string } | undefined = undefined;
      if (data.imageFile) {
        imageData = await fileToBase64(data.imageFile);
      }
      
      let logoData: { data: string, mimeType: string } | undefined = undefined;
      if (data.logoFile) {
        logoData = await fileToBase64(data.logoFile);
      }

      const imageUrl = await generateOrEditIcon(data.prompt, data.colors, imageData, logoData);
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gradient-to-br from-gray-900 to-slate-800">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl text-center">
          <IconGeneratorForm onSubmit={handleGenerate} isLoading={isLoading} />
          {error && (
            <div className="mt-4 p-3 bg-red-500/20 text-red-300 border border-red-500/30 rounded-lg">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}
          <div className="mt-8">
            <ImageDisplay imageUrl={generatedImageUrl} isLoading={isLoading} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;