import { PublicProfile } from "./Profile";

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  maxParticipants: number;
  image?: string;
  organizer: PublicProfile;
  participants: PublicProfile[];
  wishlistCount: number;
  isWishlisted: boolean;
  isRegistered: boolean;
}
