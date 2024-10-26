import { Interest } from "./Interest";

export interface PrivateProfile {
  id: number;
  firstName: string;
  birthDate: string | null;
  gender: string | null;
  interests: Interest[];
  profilePicture?: string;
}

export interface PublicProfile {
  id: number;
  firstName: string; 
  profilePicture?: string;
}