import { useEffect } from 'react';

export function useCelebHeights(
  celebHeights: number[],
  totalCelebs: number,
  setMaxCelebCardHeight: (h: number | undefined) => void
) {
  useEffect(() => {
    if (celebHeights.length === totalCelebs && celebHeights.length > 0) {
      const maxHeight = Math.max(...celebHeights);
      setMaxCelebCardHeight(maxHeight);
    }
  }, [celebHeights, totalCelebs, setMaxCelebCardHeight]);
}

export default useCelebHeights;
