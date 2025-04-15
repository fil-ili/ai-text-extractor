import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';

export async function copyToClipboard(
  text: string,
  bypass = false
): Promise<void> {
  if (text) {
    try {
      if (!bypass) {
        await Clipboard.setStringAsync(text);
        Alert.alert('Copied to clipboard');
      } else {
        console.log('Invalid text, cannot copy to clipboard');
      }
    } catch (e) {
      console.error('Error copying to clipboard:', e);
    }
  }
}
