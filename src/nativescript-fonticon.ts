import {knownFolders} from 'tns-core-modules/file-system';
import * as lib from './lib';

export class TNSFontIcon {
  public static css: any = {}; // font icon collections containing maps of classnames to unicode
  public static paths: any = {}; // file paths to font icon collections
  public static debug: boolean = false;

  public static loadCss(): Promise<any> {
    let cnt = 0;
    let currentName: string;
    const fontIconCollections = Object.keys(TNSFontIcon.paths);
    if (TNSFontIcon.debug) {
      console.log(`Collections to load: ${fontIconCollections}`);
    }

    const initCollection = () => {
      currentName = fontIconCollections[cnt];
      TNSFontIcon.css[currentName] = {};
    };

    const loadFile = (path: string): Promise<any> => {
      if (TNSFontIcon.debug) {
        console.log('----------');
        console.log(`Loading collection '${currentName}' from file: ${path}`);
      }
      const cssFile = knownFolders.currentApp().getFile(path);
      return new Promise((resolve, reject) => {
        cssFile.readText().then((data) => {
          const map = lib.mapCss(data, TNSFontIcon.debug);
          TNSFontIcon.css[currentName] = map;
          resolve();
        }, (err) => {
          reject(err);
        });
      });
    };

    const loadFiles = (): Promise<any> => {
      return new Promise((resolve) => {
        initCollection();

        if (cnt < fontIconCollections.length) {
          loadFile(TNSFontIcon.paths[currentName]).then(() => {
            cnt++;
            return loadFiles().then(() => {
              resolve();
            });
          });
        } else {
          resolve();
        }
      });
    };

    return loadFiles();
  }
}

export function fonticon(value: string): string {
  if (value) {
    if (value.indexOf('-') > -1) {
      const prefix = value.split('-')[0];
      return TNSFontIcon.css[prefix][value];
    } else {
      console.log('Fonticon classname did not contain a prefix. i.e., \'fa-bluetooth\'');
    }
  }
  return value;
}
