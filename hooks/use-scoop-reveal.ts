import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Alert } from 'react-native';

export function useScoopReveal(
  setIsScoopRevealed: (v: boolean) => void,
  fetchDailyScoop: () => Promise<void>
) {
  useEffect(() => {
    const checkStorage = async () => {
      try {
        const lastDate = await AsyncStorage.getItem('last_revealed_date');
        const today = new Date().toDateString();

        if (lastDate === today) {
          setIsScoopRevealed(true);
          await fetchDailyScoop();
        } else {
          setIsScoopRevealed(false);
        }
      } catch (e) {
        console.log('Error reading storage', e);
        Alert.alert('Error', 'An error occurred, please refresh app.');
      }
    };

    checkStorage();
  }, [fetchDailyScoop, setIsScoopRevealed]);
}

export default useScoopReveal;
