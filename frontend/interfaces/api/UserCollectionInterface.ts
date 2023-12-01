/**
 * @note anything that is only imported server side is NOT included in the client bundle by NEXT
 * @dev AVOID IMPORTING anything from this file in CLIENT side. This file is only for SERVER side.
 */

interface UsersCollectionSocialInterface {
  github: string;
  linkedIn: string;
  twitter: string;
  email: string;
}

interface UsersCollectionInterface {
  walletAddress: `0x${string}`;
  displayName: string;
  displayTitle: string;
  description: string;
  profileBannerUrl: string;
  profilePictureUrl: string;
  nonceArray: string[];
  lastRequestTimestamp: number;
  socials: UsersCollectionSocialInterface;
}

export type { UsersCollectionInterface };
