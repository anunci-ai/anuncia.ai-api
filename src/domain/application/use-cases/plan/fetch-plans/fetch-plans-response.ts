export interface FetchPlansReponse {
  plans: {
    name: string;
    priceInCents: number;
    tokensQuantity: number;
    createdAt?: Date;
  }[];
}
