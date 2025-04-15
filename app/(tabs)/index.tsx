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
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldClear, setShouldClear] = useState(false);

  async function pickImage(): Promise<void> {
    setIsLoading(true);
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        console.log('Permission to access camera roll is required!');
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
        if (asset.base64) {
          const replicateResponse = await getTextFromImage(asset.base64);
          setExtractedText(replicateResponse?.data);
        }
      }
    } catch (error) {
      console.log('Error picking image:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function captureImage(): Promise<void> {
    setIsLoading(true);
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!cameraPermission.granted) {
        console.log('Permission to access camera is required!');
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
        if (asset.base64) {
          const replicateResponse = await getTextFromImage(asset.base64);
          setExtractedText(replicateResponse?.data);
        }
      }
    } catch (error) {
      console.log('Error capturing image:', error);
    } finally {
      setIsLoading(false);
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
    if (extractedText) {
      if (extractedText !== 'Invalid' && extractedText.length > 0) {
        await copyToClipboard(extractedText);
      } else {
        console.log('Invalid text, cannot copy to clipboard');
      }
    }
  }

  useEffect(() => {
    if (shouldClear) {
      setImageUri(null);
      setExtractedText(null);
      setShouldClear(false);
      setShouldClear(false);
    }
  }, [shouldClear]);

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

        {extractedText && extractedText !== 'Invalid' && !isLoading && (
          <View style={styles.textContainer}>
            <View style={styles.card}>
              <Text style={styles.cardText}>{extractedText}</Text>
            </View>
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
            (!extractedText || extractedText === 'Invalid') &&
              styles.disabledFab,
          ]}
          onPress={handleOnCopy}
          disabled={!extractedText || extractedText === 'Invalid'}
        >
          <Ionicons
            name='copy-outline'
            size={20}
            color={
              !extractedText || extractedText === 'Invalid' ? '#ccc' : '#333'
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
});
