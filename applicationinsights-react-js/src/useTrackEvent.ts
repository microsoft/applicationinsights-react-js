/**
 * ReactPlugin.ts
 * @copyright Microsoft 2019
 */
import ReactPlugin from "./ReactPlugin";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export type AIReactCustomEvent<T> = Dispatch<SetStateAction<T>>;

export default function useCustomEvent<T>(
  reactPlugin: ReactPlugin,
  eventName: string,
  eventData: T,
  skipFirstRun = true
): AIReactCustomEvent<T> {
  const [data, setData] = useState(eventData);
  const firstRun = useRef(skipFirstRun);
  const savedSkipFirstRun = useRef(skipFirstRun);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    reactPlugin.trackEvent({ name: eventName }, data);
  }, [reactPlugin, data, eventName]);

  useEffect(() => {
    return () => {
      firstRun.current = savedSkipFirstRun.current;
    };
  }, []);

  return setData as AIReactCustomEvent<T>;
}
