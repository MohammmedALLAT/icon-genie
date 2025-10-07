// src/services/geminiService.ts

export async function generateOrEditIcon(
  subject: string,
  colors: string,
  imageData?: { data: string; mimeType: string },
  logoData?: { data: string; mimeType: string }
): Promise<string> {
  const response = await fetch('/api/generateIcon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: subject,
      colors,
      imageData,
      logoData,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate image.');
  }

  const data = await response.json();
  return data.imageUrl;
}
