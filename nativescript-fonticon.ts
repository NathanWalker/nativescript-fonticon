import * as app from 'application';
import {knownFolders} from 'file-system';

export class TNSFontIcon {
  public static css: any = {}; // font icon collections containing maps of classnames to unicode
  public static paths: any = {}; // file paths to font icon collections
  public static debug: boolean = false;

  public static loadCss(): Promise<any> {
    let cnt = 0;
    let currentName: string;
    let fontIconCollections = Object.keys(TNSFontIcon.paths);
    if (TNSFontIcon.debug) {
      console.log(`Collections to load: ${fontIconCollections}`);
    }

    let initCollection = () => {
      currentName = fontIconCollections[cnt];
      TNSFontIcon.css[currentName] = {};
    };

    let mapCss = (data: any): void => {
      let sets = data.split('}');
      let cleanValue = (val) => {
        let v = val.split('content:')[1].replace(/\\f/, '\\uf').trim().replace(/\"/g, '').slice(0, -1);
        return v;
      };

      for (let set of sets) {
        let pair = set.split(':before {');
        let keyGroups = pair[0];
        let keys = keyGroups.split(',');
        if (pair[1]) {
          let value = cleanValue(pair[1]);
          for (let key of keys) {
            key = key.trim().slice(1).split(':before')[0];
            TNSFontIcon.css[currentName][key] = String.fromCharCode(parseInt(value.substring(2), 16));
            if (TNSFontIcon.debug) {
              console.log(`${key}: ${value}`);
            }
          }
        }
      }
    };    

    let loadFile = (path: string): Promise<any> => {
      if (TNSFontIcon.debug) {
        console.log(`----------`);
        console.log(`Loading collection '${currentName}' from file: ${path}`);
      }
      let cssFile = knownFolders.currentApp().getFile(path);
      return new Promise((resolve, reject) => {
        cssFile.readText().then((data) => {
          mapCss(data);
          resolve();
        }, (err) => {
          reject(err);
        });  
      });
    };    
    
    let loadFiles = (): Promise<any> => {
      return new Promise((resolve) => {
        initCollection();
        
        if (cnt < fontIconCollections.length) {
          loadFile(TNSFontIcon.paths[currentName]).then(() => {
            cnt++;
            return loadFiles().then(() => {
              resolve()
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
      let prefix = value.split('-')[0];
      return TNSFontIcon.css[prefix][value];
    } else {
      console.log(`Fonticon classname did not contain a prefix. i.e., 'fa-bluetooth'`);
    }
  }
  return value;
}

