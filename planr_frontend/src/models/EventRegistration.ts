import { PublicUser } from "./User";

export interface EventRegistration {
  user: PublicUser;
  eventId: number;
  registeredAt: string;
}
