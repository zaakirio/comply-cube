/* eslint-disable  @typescript-eslint/no-explicit-any */
interface ComplyCubeSDK {
  mount: (config: {
    token: string;
    containerId: string;
    onComplete?: (data: any) => void;
    onError?: (error: Error) => void;
    onCancelled?: () => void;
    onClosed?: () => void;
  }) => void;
}

declare global {
  interface Window {
    ComplyCube: ComplyCubeSDK;
  }
}