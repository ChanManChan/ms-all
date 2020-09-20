import { Publisher, Subjects, TicketUpdatedEvent } from '@nandagopalms/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
