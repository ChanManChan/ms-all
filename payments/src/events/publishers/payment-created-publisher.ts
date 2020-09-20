import { Subjects, Publisher, PaymentCreatedEvent } from '@nandagopalms/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
