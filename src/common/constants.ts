export enum Region {
  NorthAmerica = 'NorthAmerica',
  Europe = 'Europe',
  FarEast = 'FarEast',
}

export const SP_API_URL: Record<Region, string> = {
  NorthAmerica: 'https://sellingpartnerapi-na.amazon.com',
  Europe: 'https://sellingpartnerapi-eu.amazon.com',
  FarEast: 'https://sellingpartnerapi-fe.amazon.com',
};
