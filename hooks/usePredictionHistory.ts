import { useCallback, useState } from 'react';
import { type Prediction } from 'replicate';
import { replicate } from '@/core/replicate';
import { copyToClipboard } from '@/utils/copyToClipboard';

interface PredictionHistoryHook {
  predictions: Prediction[];
  isLoading: boolean;
  fetchPastPredictions: () => Promise<void>;
  handleOnCopy: (output?: string) => Promise<void>;
}

export function usePredictionHistory(): PredictionHistoryHook {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    predictions,
    isLoading,
    fetchPastPredictions,
    handleOnCopy,
  };
}
