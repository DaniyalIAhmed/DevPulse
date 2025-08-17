export interface TemplateFile {
    filename: string;
    fileExtension: string;
    content: string;
  }
  export interface PlaygroundData {
    id: string;
    name?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }
  
  export interface TemplateFolder {
    folderName: string;
    items: (TemplateFile | TemplateFolder)[];
  }
  
  export interface LoadingStepProps {
    currentStep: number;
    step: number;
    label: string;
  }
  
  export interface OpenFile extends TemplateFile {
    id: string;
    hasUnsavedChanges: boolean;
    content: string;
    originalContent: string;
  }
  