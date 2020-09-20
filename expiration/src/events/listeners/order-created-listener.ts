import { Listener, OrderCreatedEvent, Subjects } from '@nandagopalms/common'
import { Message } from 'node-nats-streaming'
import { queueGroupName } from './queue-group-name'
import { expirationQueue } from '../../queues/expiration-queue'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated

  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // time in ms
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

    // whenever we receive this event, enqueue this job to set the expiration timer
    await expirationQueue.add({
      orderId: data.id
    }, {
      delay
    })
    msg.ack()
  }
}
