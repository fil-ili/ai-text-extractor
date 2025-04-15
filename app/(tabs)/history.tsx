import {
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { type Prediction } from 'replicate';
import { Collapsible } from '@/components/Collapsible';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { Separator } from '@/components/Separator';
import { parseFullDate } from '@/utils/parseFullDate';
import { useIsFocused } from '@react-navigation/native';
import { replicate } from '@/core/replicate';

export default function HistoryScreen() {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFocused = useIsFocused();

  const fetchPastPredictions = useCallback(async () => {
    setIsLoading(true);
    try {
      const page = await replicate.predictions.list();
      const results = (page?.results || []).filter((p) => p.output?.length > 0);
      setPredictions(results);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleOnCopy = useCallback(async (output?: string) => {
    if (output) {
      await copyToClipboard(output);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchPastPredictions();
    }
  }, [isFocused, fetchPastPredictions]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>History</Text>

        {isLoading && predictions.length === 0 && (
          <ActivityIndicator style={styles.loadingIndicator} />
        )}

        {predictions.map((prediction, idx) => {
          const createdAt = parseFullDate(prediction.created_at);

          return (
            <Fragment key={prediction.id}>
              <Collapsible title={createdAt}>
                <Text style={styles.predictionOutput}>
                  {prediction?.output}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  accessibilityLabel='Copy prediction output'
                  onPress={() => handleOnCopy(prediction?.output)}
                >
                  <Text>Copy</Text>
                </TouchableOpacity>
              </Collapsible>
              {idx < predictions.length - 1 && <Separator />}
            </Fragment>
          );
        })}
      </ScrollView>
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
    paddingBottom: 60,
  },
  loadingIndicator: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: 'white',
  },
  predictionOutput: {
    fontSize: 12,
    color: 'white',
    padding: 8,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 8,
    width: 120,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 8,
  },
});
