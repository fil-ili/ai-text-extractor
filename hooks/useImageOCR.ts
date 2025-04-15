import { useCallback, useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';
import { getTextFromImage } from '@/utils/getTextFromImage';
import { copyToClipboard } from '@/utils/copyToClipboard';

interface OCRHook {
  imageUri: string | null;
  extractedText: string | null;
  isLoading: boolean;
  error: string | null;
  shouldClear: boolean;
  pickImage: () => Promise<void>;
  captureImage: () => Promise<void>;
  handleOnCopy: () => Promise<void>;
  handleOnClear: () => void;
  handleRetry: () => Promise<void>;
}

export function useImageOCR(): OCRHook {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldClear, setShouldClear] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtractText = useCallback(async (base64: string) => {
    try {
      const { data, error: modelError } = await getTextFromImage(base64);
      if (modelError) {
        setError(modelError);
        setExtractedText(null);
      } else {
        setExtractedText(data || '');
        setError(null);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setExtractedText(null);
    }
  }, []);

  const pickImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        setIsLoading(false);
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        base64: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64 ?? null);
        if (asset.base64) {
          await handleExtractText(asset.base64);
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [handleExtractText]);

  const captureImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        setIsLoading(false);
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        aspect: [4, 3],
        quality: 1,
        allowsEditing: true,
        base64: true,
      });
      if (!result.canceled && result.assets?.[0]) {
        const asset = result.assets[0];
        setImageUri(asset.uri);
        setImageBase64(asset.base64 ?? null);
        if (asset.base64) {
          await handleExtractText(asset.base64);
        }
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [handleExtractText]);

  const handleOnCopy = useCallback(async () => {
    if (extractedText && extractedText.length > 0) {
      await copyToClipboard(extractedText);
    }
  }, [extractedText]);

  const handleOnClear = useCallback(() => {
    Alert.alert('Do you want to clear the image?', '', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => setShouldClear(true),
      },
    ]);
  }, []);

  const handleRetry = useCallback(async () => {
    if (!imageBase64) return;
    setIsLoading(true);
    setError(null);
    try {
      await handleExtractText(imageBase64);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [imageBase64, handleExtractText]);

  useEffect(() => {
    if (shouldClear) {
      setImageUri(null);
      setImageBase64(null);
      setExtractedText(null);
      setError(null);
      setShouldClear(false);
    }
  }, [shouldClear]);

  return {
    imageUri,
    extractedText,
    isLoading,
    error,
    shouldClear,
    pickImage,
    captureImage,
    handleOnCopy,
    handleOnClear,
    handleRetry,
  };
}
