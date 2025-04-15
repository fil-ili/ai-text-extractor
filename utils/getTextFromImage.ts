import { replicate } from '@/core/replicate';

export async function getTextFromImage(base64Data: string) {
  const dataUrl = `data:image/jpeg;base64,${base64Data}`;
  try {
    const output = await replicate.run(
      'abiruyt/text-extract-ocr:a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61',
      {
        input: {
          image: dataUrl,
        },
      }
    );

    if (typeof output === 'string') {
      return { data: output };
    }
    return { data: 'Invalid' };
  } catch (e) {
    return { data: 'Invalid' };
  }
}
