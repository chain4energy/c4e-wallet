import {BigDecimal} from "@/models/store/big.decimal";
import {TokenPrice} from "@/models/store/tokens";
import {Coin, DecCoin} from "@/models/store/common";
import {Currency} from "@/models/currency";

export function calculatePrice(amount: bigint | number | BigDecimal | Coin | DecCoin, tokenPrice: TokenPrice){
  const tokenPriceNumber = tokenPrice.price;
  if( amount instanceof DecCoin ){
    return new DecCoin(amount.amount.multiply(tokenPriceNumber), getDenom(tokenPrice.currency));
  } else if(  amount instanceof Coin) {
    return new DecCoin(new BigDecimal(amount.amount).multiply(tokenPriceNumber), getDenom(tokenPrice.currency));
  } else if( amount instanceof BigDecimal) {
    return amount.multiply(tokenPriceNumber);
  } else if( typeof (amount) === 'bigint') {
    return new BigDecimal(amount).multiply(tokenPriceNumber);
  } else {
    return amount * tokenPriceNumber;
  }
}

function getDenom( currency: Currency){
  if(currency === Currency.USD){
    return "$";
  }
  throw Error('Not supported');
}
