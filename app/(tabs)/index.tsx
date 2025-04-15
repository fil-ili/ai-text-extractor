import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useImageOCR } from '@/hooks/useImageOCR';

export default function HomeScreen(): JSX.Element {
  const {
    imageUri,
    extractedText,
    isLoading,
    error,
    pickImage,
    captureImage,
    handleOnCopy,
    handleOnClear,
    handleRetry,
  } = useImageOCR();

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Text Extractor</Text>

        {!imageUri && !isLoading && (
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            <Image
              source={require('../../assets/images/uploadImage.png')}
              style={styles.imagePreview}
            />
            <Text style={styles.uploadImageHint}>
              Upload an image with text
            </Text>
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
