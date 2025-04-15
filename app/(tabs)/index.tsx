import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { getTextFromImage } from '@/utils/getTextFromImage';
import { copyToClipboard } from '@/utils/copyToClipboard';

export default function HomeScreen(): JSX.Element {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldClear, setShouldClear] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickImage(): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        console.log('Permission to access camera roll is required!');
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
    } catch (err) {
      console.log('Error picking image:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function captureImage(): Promise<void> {
    setIsLoading(true);
    setError(null);
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!cameraPermission.granted) {
        console.log('Permission to access camera is required!');
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
    } catch (err) {
      console.log('Error capturing image:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExtractText(base64: string) {
    try {
      const { data, error: modelError } = await getTextFromImage(base64);

      if (modelError) {
        setError(modelError);
        setExtractedText(null);
      } else {
        setExtractedText(data || ''); // if data is null, store empty string
        setError(null);
      }
    } catch (err) {
      console.log('Error extracting text:', err);
      setError('Something went wrong. Please try again.');
      setExtractedText(null);
    }
  }

  function handleOnClear() {
    Alert.alert('Do you want to clear the image?', '', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => setShouldClear(true),
      },
    ]);
  }

  async function handleOnCopy() {
    if (extractedText && extractedText.length > 0) {
      await copyToClipboard(extractedText);
    } else {
      console.log('No text to copy');
    }
  }

  useEffect(() => {
    if (shouldClear) {
      setImageUri(null);
      setImageBase64(null);
      setExtractedText(null);
      setError(null);
      setShouldClear(false);
    }
  }, [shouldClear]);

  async function handleRetry() {
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
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Generate Text</Text>

        {!imageUri && !isLoading && (
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/uploadImage.png')}
              style={styles.imagePreview}
            />
            <Text style={styles.uploadImageHint}>Upload an image to begin</Text>
          </TouchableOpacity>
        )}

        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
          </View>
        )}

        {isLoading && <ActivityIndicator style={styles.loadingIndicator} />}

        {extractedText && extractedText.length > 0 && !isLoading && (
          <View style={styles.textContainer}>
            <View style={styles.card}>
              <Text style={styles.cardText}>{extractedText}</Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.retryContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRetry}
              disabled={isLoading}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[styles.fabIcon, isLoading && styles.disabledFab]}
          onPress={pickImage}
          disabled={isLoading}
        >
          <Ionicons
            name='image-outline'
            size={20}
            color={isLoading ? '#ccc' : '#333'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fabIcon, isLoading && styles.disabledFab]}
          onPress={captureImage}
          disabled={isLoading}
        >
          <Ionicons
            name='camera-outline'
            size={20}
            color={isLoading ? '#ccc' : '#333'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.fabIcon,
            !extractedText || extractedText.length === 0
              ? styles.disabledFab
              : null,
          ]}
          onPress={handleOnCopy}
          disabled={!extractedText || extractedText.length === 0}
        >
          <Ionicons
            name='copy-outline'
            size={20}
            color={
              !extractedText || extractedText.length === 0 ? '#ccc' : '#333'
            }
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.fabIcon, !imageUri && styles.disabledFab]}
          onPress={handleOnClear}
          disabled={!imageUri}
        >
          <Ionicons
            name='trash-outline'
            size={20}
            color={!imageUri ? '#ccc' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    paddingBottom: 60,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: 'white',
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  textContainer: {
    width: '100%',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#252526',
    borderRadius: 8,
    padding: 16,
  },
  cardText: {
    fontSize: 12,
    color: 'white',
  },
  imageContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 32,
    borderRadius: 8,
  },
  imagePreview: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  uploadImageHint: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  fabContainer: {
    position: 'absolute',
    right: 12,
    bottom: 90,
    alignItems: 'center',
  },
  fabIcon: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 8,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledFab: {
    opacity: 0.5,
  },
  retryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: '#f00',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
