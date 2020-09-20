import { Subjects, Publisher, ExpirationCompleteEvent } from '@nandagopalms/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
