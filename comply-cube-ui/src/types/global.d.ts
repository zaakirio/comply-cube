export {};

declare global {
  interface Window {
    ComplyCube?: {
      mount: (config: any) => any; 
    };
  }
}
