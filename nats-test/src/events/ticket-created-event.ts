import { Subjects } from './subjects'

// Structure of an event
// tight coupling between the very specific subject name and the structure of data
export interface TicketCreatedEvent {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  }
}
