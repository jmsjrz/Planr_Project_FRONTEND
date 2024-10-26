import { PrivateProfile, PublicProfile } from "./Profile";

export interface PrivateUser {
  id: number;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  profile: PrivateProfile;
}

export interface PublicUser {
  id: number;
  profile: PublicProfile;
}
