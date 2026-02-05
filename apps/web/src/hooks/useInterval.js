import { useEffect, useRef } from 'react';

export function useInterval(callback, delay, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled || delay == null) return undefined;

    const tick = () => savedCallback.current();
    const id = window.setInterval(tick, delay);
    return () => window.clearInterval(id);
  }, [delay, enabled]);
}

export default useInterval;
