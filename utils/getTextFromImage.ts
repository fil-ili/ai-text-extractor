import { replicate } from '@/core/replicate';

export async function getTextFromImage(base64Data: string) {
  const dataUrl = `data:image/jpeg;base64,${base64Data}`;

  try {
    const output = await replicate.run(
      'abiruyt/text-extract-ocr:a524caeaa23495bc9edc805ab08ab5fe943afd3febed884a4f3747aa32e9cd61',
      {
        input: { image: dataUrl },
      }
    );

    if (typeof output === 'string') {
      const trimmed = (output as string).trim();
      if (!trimmed) {
        return {
          data: null,
          error: 'No text recognized from model',
        };
      }

      return {
        data: trimmed,
        error: null,
      };
    }

    return {
      data: null,
      error: 'Model output not recognized',
    };
  } catch (e) {
    return {
      data: null,
      error: e instanceof Error ? e.message : 'Unknown error occurred',
    };
  }
}
