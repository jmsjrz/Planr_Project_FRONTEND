import { PublicProfile } from "./Profile";

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  date: string;
  time: string;
  maxParticipants: number;
  categoryDisplay: string;
  image?: string;
  organizer: PublicProfile;
  participants: PublicProfile[];
  wishlistCount: number;
  isWishlisted: boolean;
  isRegistered: boolean;
}
