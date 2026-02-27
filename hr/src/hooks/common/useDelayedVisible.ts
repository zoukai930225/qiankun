// useDelayedVisible.ts
import { ref, watch, onUnmounted } from 'vue';

export default function useDelayedVisible(source: Ref<boolean>, delay: number = 1000) {
  const delayed = ref(false);
  let timeoutId: number | null = null;

  const clear = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  watch(source, (newVal) => {
    clear();
    
    if (!newVal) {
      timeoutId = window.setTimeout(() => {
        delayed.value = false;
      }, delay);
    } else {
      delayed.value = true;
    }
  });

  onUnmounted(clear);

  return [delayed];
}