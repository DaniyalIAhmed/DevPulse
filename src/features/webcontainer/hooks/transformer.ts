import { TemplateFile, TemplateFolder } from '@/features/playgrounds/lib/path-to-json';

type TemplateItem = TemplateFile | TemplateFolder;
  
  interface WebContainerFile {
    file: {
      contents: string;
    };
  }
  
  interface WebContainerDirectory {
    directory: {
      [key: string]: WebContainerFile | WebContainerDirectory;
    };
  }
  
  type WebContainerFileSystem = Record<string, WebContainerFile | WebContainerDirectory>;
  
    export function transformToWebContainerFormat(template: TemplateFolder): WebContainerFileSystem {
    function processItem(item: TemplateItem): WebContainerFile | WebContainerDirectory {
      if ('folderName' in item && 'items' in item) {
        // This is a directory
        const directoryContents: WebContainerFileSystem = {};
        
        item.items.forEach(subItem => {
          const key = 'filename' in subItem && subItem.fileExtension 
            ? `${subItem.filename}.${subItem.fileExtension}`
            : ('folderName' in subItem ? subItem.folderName : 'unknown');
          directoryContents[key] = processItem(subItem);
        });

        return {
          directory: directoryContents
        };
      } else {
        // This is a file
        return {
          file: {
            contents: item.content
          }
        };
      }
    }

    const result: WebContainerFileSystem = {};
    
    template.items.forEach(item => {
      const key = 'filename' in item && item.fileExtension 
        ? `${item.filename}.${item.fileExtension}`
        : ('folderName' in item ? item.folderName : 'unknown');
      result[key] = processItem(item);
    });

    return result;
  }