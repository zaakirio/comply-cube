// src/types/complycube.d.ts
interface ComplyCubeSDK {
    open: () => void;
  }
  
  interface ComplyCubeConstructor {
    new(config: { token: string; clientId: string }): ComplyCubeSDK;
  }
  
  declare global {
    interface Window {
      ComplyCube: ComplyCubeConstructor;
    }
  }