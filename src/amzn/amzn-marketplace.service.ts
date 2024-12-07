import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Client } from 'src/client/entities/client.entity';
import { Region, SP_API_URL } from 'src/common/constants';
import { LwaService } from 'src/lwa/lwa.service';
import {
  MarketplaceEntry,
  MarketplaceParticipationResponse,
} from './dto/marketplace.dto';

@Injectable()
export class AmznMarketplaceService {
  private readonly logger = new Logger(AmznMarketplaceService.name);
  private marketplaceEntries: Array<MarketplaceEntry> = [
    {
      marketplaceId: 'A2EUQ1WTGCTBG2',
      country: 'Canada',
      countryCode: 'CA',
      region: Region.NorthAmerica,
    },
    {
      marketplaceId: 'ATVPDKIKX0DER',
      country: 'United States of America',
      countryCode: 'US',
      region: Region.NorthAmerica,
    },
    {
      marketplaceId: 'A1AM78C64UM0Y8',
      country: 'Mexico',
      countryCode: 'MX',
      region: Region.NorthAmerica,
    },
    {
      marketplaceId: 'A2Q3Y263D00KWC',
      country: 'Brazil',
      countryCode: 'BR',
      region: Region.NorthAmerica,
    },
    {
      marketplaceId: 'A1RKKUPIHCS9HS',
      country: 'Spain',
      countryCode: 'ES',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A1F83G8C2ARO7P',
      country: 'United Kingdom',
      countryCode: 'UK',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A13V1IB3VIYZZH',
      country: 'France',
      countryCode: 'FR',
      region: Region.Europe,
    },
    {
      marketplaceId: 'AMEN7PMS3EDWL',
      country: 'Belgium',
      countryCode: 'BE',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A1805IZSGTT6HS',
      country: 'Netherlands',
      countryCode: 'NL',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A1PA6795UKMFR9',
      country: 'Germany',
      countryCode: 'DE',
      region: Region.Europe,
    },
    {
      marketplaceId: 'APJ6JRA9NG5V4',
      country: 'Italy',
      countryCode: 'IT',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A2NODRKZP88ZB9',
      country: 'Sweden',
      countryCode: 'SE',
      region: Region.Europe,
    },
    {
      marketplaceId: 'AE08WJ6YKNBMC',
      country: 'South Africa',
      countryCode: 'ZA',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A1C3SOZRARQ6R3',
      country: 'Poland',
      countryCode: 'PL',
      region: Region.Europe,
    },
    {
      marketplaceId: 'ARBP9OOSHTCHU',
      country: 'Egypt',
      countryCode: 'EG',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A33AVAJ2PDY3EV',
      country: 'Turkey',
      countryCode: 'TR',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A17E79C6D8DWNP',
      country: 'Saudi Arabia',
      countryCode: 'SA',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A2VIGQ35RCS4UG',
      country: 'United Arab Emirates',
      countryCode: 'AE',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A21TJRUUN4KGV',
      country: 'India',
      countryCode: 'IN',
      region: Region.Europe,
    },
    {
      marketplaceId: 'A19VAU5U5O7RUS',
      country: 'Singapore',
      countryCode: 'SG',
      region: Region.FarEast,
    },
    {
      marketplaceId: 'A39IBJ37TRP1C6',
      country: 'Australia',
      countryCode: 'AU',
      region: Region.FarEast,
    },
    {
      marketplaceId: 'A1VC38T7YXB528',
      country: 'Japan',
      countryCode: 'JP',
      region: Region.FarEast,
    },
  ];

  constructor(
    private readonly httpService: HttpService,
    private readonly lwaService: LwaService,
  ) {}

  /**
   * Filters the list of Amazon marketplaces based on the provided criteria.
   *
   * @param filter - An object containing key-value pairs to filter the marketplaces.
   * @returns MarketplaceEntry | undefined - The first marketplace entry that matches all the filter criteria, or undefined if no match is found.
   *
   **/
  findOne(filter: Partial<MarketplaceEntry>): MarketplaceEntry | undefined {
    return this.marketplaceEntries.find((entry) => {
      return Object.keys(filter).every((key) => {
        return entry[key] === filter[key];
      });
    });
  }

  async getMarketplaceParticipations(client: Client) {
    try {
      const accessToken = await this.lwaService.getAccessToken(client);

      const { data } = await firstValueFrom(
        this.httpService.get<MarketplaceParticipationResponse>(
          SP_API_URL.NorthAmerica + '/sellers/v1/marketplaceParticipations',
          {
            headers: {
              'x-amz-access-token': accessToken,
            },
          },
        ),
      );

      const marketplaces = data.payload
        .map((entry) => {
          const marketplace = this.findOne({
            marketplaceId: entry.marketplace.id,
          });

          if (!marketplace) {
            return null;
          }

          const { id, ...entryData } = entry.marketplace;

          return {
            ...marketplace,
            ...entryData,
            marketplaceId: id,
          };
        })
        .filter((entry) => entry !== null);

      return marketplaces;
    } catch (error) {
      console.log(error?.response?.data);
      this.logger.error(error);
      throw error;
    }
  }
}
