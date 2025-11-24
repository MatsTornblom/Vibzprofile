/// <reference types="vite/client" />

interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
  isReactNativeWebView?: boolean;
  webkit?: {
    messageHandlers?: {
      ReactNativeWebView?: {
        postMessage: (message: any) => void;
      };
    };
  };
}