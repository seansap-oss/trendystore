export type MarketCatalogue = {
  id: string; // 'market_au' | 'market_in'
  code: 'AU' | 'IN';
  name: string;
  countryCode: string;
  currency: 'AUD' | 'INR';
  locale: 'en-AU' | 'en-IN';
  currencySymbol: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

export const MARKET_CATALOGUES: MarketCatalogue[] = [
  {
    id:'market_au',
    code:'AU',
    name:'Australia Supermarket',
    countryCode:'AU',
    currency:'AUD',
    locale:'en-AU',
    currencySymbol:'$',
    isActive:true,
    isDefault:false,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
  },
  {
    id:'market_in',
    code:'IN',
    name:'India Supermarket',
    countryCode:'IN',
    currency:'INR',
    locale:'en-IN',
    currencySymbol:'₹',
    isActive:true,
    isDefault:true,
    createdAt:new Date().toISOString(),
    updatedAt:new Date().toISOString(),
  },
];

export const getMarket = (code: 'AU'|'IN') => MARKET_CATALOGUES.find(m=>m.code===code)!;
export const DEFAULT_MARKET: MarketCatalogue = getMarket('IN');
