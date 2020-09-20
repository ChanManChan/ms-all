import { Subjects, Publisher, OrderCancelledEvent } from '@nandagopalms/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
