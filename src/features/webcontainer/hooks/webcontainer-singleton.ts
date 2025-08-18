import { WebContainer } from '@webcontainer/api';

class WebContainerSingleton {
  private static instance: WebContainer | null = null;
  private static isBooting = false;
  private static bootPromise: Promise<WebContainer> | null = null;

  static async getInstance(): Promise<WebContainer> {
    // If we already have an instance, return it
    if (this.instance) {
      console.log("WebContainerSingleton: Returning existing instance");
      return this.instance;
    }

    // If we're currently booting, wait for that to complete
    if (this.isBooting && this.bootPromise) {
      console.log("WebContainerSingleton: Boot in progress, waiting...");
      return this.bootPromise;
    }

    // Start booting a new instance
    console.log("WebContainerSingleton: Starting new boot process...");
    this.isBooting = true;
    this.bootPromise = this.bootWebContainer();
    
    try {
      this.instance = await this.bootPromise;
      console.log("WebContainerSingleton: Boot completed successfully");
      return this.instance;
    } finally {
      this.isBooting = false;
      this.bootPromise = null;
    }
  }

  private static async bootWebContainer(): Promise<WebContainer> {
    try {
      return await WebContainer.boot();
    } catch (error) {
      console.error('Failed to boot WebContainer:', error);
      throw error;
    }
  }

  static async teardown(): Promise<void> {
    if (this.instance) {
      try {
        await this.instance.teardown();
      } catch (error) {
        console.error('Error during WebContainer teardown:', error);
      } finally {
        this.instance = null;
      }
    }
  }

  static isInstanceAvailable(): boolean {
    return this.instance !== null;
  }
}

export default WebContainerSingleton;
