import { MarketplaceEnum } from "../../../../enterprise/entities/listing";

export interface CreateListingDTO {
  userId: string;
  marketplace: MarketplaceEnum;
  inputDescription: string;
}
