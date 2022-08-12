export function formatBigNumber(locale: string, amount: string) {
  let decSeparator: string;
  let thousendsSeparator: string;
  switch(locale) {
    case 'en-US': {
      decSeparator = '.';
      thousendsSeparator = ',';
      break;
    }
    case 'pl-PL': {
      decSeparator = ',';
      thousendsSeparator = ' ';
      break;
    }
    default: {
      return amount;
    }
  }

  const intAndDec = amount.split('.');
  let intPart = intAndDec[0];
  let formated = String();
  while (intPart.length > 0 ) {
    const longEnough = intPart.length > 3;
    formated = longEnough ? thousendsSeparator + intPart.slice(-3) + formated : intPart + formated;
    intPart = intPart.slice(0, -3);
  }
  const decis = intAndDec[1] ? intAndDec[1].replace(/\.?0+$/, "") : '';
  return intAndDec[1] != undefined && decis.length > 0 ? formated += decSeparator + intAndDec[1] : formated
}