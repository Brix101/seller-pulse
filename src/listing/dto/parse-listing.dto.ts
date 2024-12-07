import { ListingStatus } from '../entities/listing.entity';

export class ParseListingDto {
  sellerSKU: string;
  asin: string;
  status: ListingStatus;
}
