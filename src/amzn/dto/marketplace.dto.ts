export class MarketplaceEntry {
  marketplaceId: string;
  countryCode: string;
  country: string;
  region: string;
}

export interface MarketplaceParticipation {
  marketplace: {
    id: string;
    countryCode: string;
    name: string;
    defaultCurrencyCode: string;
    defaultLanguageCode: string;
    domainName: string;
  };
  participation: {
    isParticipating: boolean;
    hasSuspendedListings: boolean;
  };
}

export interface MarketplaceParticipationResponse {
  payload: MarketplaceParticipation[];
}
