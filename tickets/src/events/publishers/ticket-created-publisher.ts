import { Subjects, TicketCreatedEvent, Publisher } from '@nandagopalms/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
 readonly subject = Subjects.TicketCreated
}
