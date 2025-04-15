import Replicate from 'replicate';

export const replicate = new Replicate({
  auth: process.env.EXPO_PUBLIC_REPLICATE_API_TOKEN,
});
