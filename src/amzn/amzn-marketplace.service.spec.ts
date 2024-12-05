import { Test, TestingModule } from '@nestjs/testing';
import { AmznMarketplaceService } from './amzn-marketplace.service';

describe('AmznMarketplaceService', () => {
  let service: AmznMarketplaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmznMarketplaceService],
    }).compile();

    service = module.get<AmznMarketplaceService>(AmznMarketplaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('filterMarketplaces', () => {
    it('should return the correct marketplace based on filter criteria', () => {
      const marketplaces = [
        {
          marketplaceId: 'A2EUQ1WTGCTBG2',
          country: 'Canada',
          countryCode: 'CA',
          region: 'NorthAmerica',
        },
        {
          marketplaceId: 'ATVPDKIKX0DER',
          country: 'United States of America',
          countryCode: 'US',
          region: 'NorthAmerica',
        },
        {
          marketplaceId: 'A1AM78C64UM0Y8',
          country: 'Mexico',
          countryCode: 'MX',
          region: 'NorthAmerica',
        },
      ];

      service['marketplaceEntries'] = marketplaces; // Assuming marketplaces is a private property

      const filter = { marketplaceId: 'ATVPDKIKX0DER' };
      const result = service.findOne(filter);

      expect(result).toEqual({
        marketplaceId: 'ATVPDKIKX0DER',
        country: 'United States of America',
        countryCode: 'US',
        region: 'NorthAmerica',
      });
    });

    it('should return undefined if no marketplace matches the filter criteria', () => {
      const marketplaces = [
        {
          marketplaceId: 'A2EUQ1WTGCTBG2',
          country: 'Canada',
          countryCode: 'CA',
          region: 'NorthAmerica',
        },
        {
          marketplaceId: 'ATVPDKIKX0DER',
          country: 'United States of America',
          countryCode: 'US',
          region: 'NorthAmerica',
        },
        {
          marketplaceId: 'A1AM78C64UM0Y8',
          country: 'Mexico',
          countryCode: 'MX',
          region: 'NorthAmerica',
        },
      ];

      service['marketplaceEntries'] = marketplaces; // Assuming marketplaces is a private property

      const filter = { country: 'FR', currency: 'EUR' };
      const result = service.findOne(filter);

      expect(result).toBeUndefined();
    });
  });
});
