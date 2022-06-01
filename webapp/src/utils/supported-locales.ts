export class LocaleConfig {
  file: string;
  name: string;
  flagCode: string;
  constructor (file:string, name:string, flagCode: string) {
    this.file = file;
    this.name = name;
    this.flagCode = flagCode;
  }
}

export function getSupportedLocales () : Array<LocaleConfig> {
  const annotatedLocales: LocaleConfig[] = [];
  annotatedLocales.push(new LocaleConfig('pl', 'polski', 'pl'));
  annotatedLocales.push(new LocaleConfig('en', 'english', 'gb'));
  return annotatedLocales;
}
