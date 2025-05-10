export interface tokenData {
  tokenName: string;
  tokenSymbol: string;
  ownerAddress: string;
  mintingWalletAddress?: string;
  tokenAmount: number;
  eventRegistration?: boolean;
  eventName?: string;
  eventDate?: string;
  eventDescription?: string;
}
