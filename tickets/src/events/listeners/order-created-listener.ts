import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'
import { Listener, OrderCreatedEvent, Subjects } from '@nandagopalms/common'
import { queueGroupName } from './queue-group-name'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id)

    // If no ticket, throw error
    if(!ticket)
      throw new Error('Ticket not found')

    // Mark the ticket as being reserved by setting the orderId property
    ticket.set({ orderId: data.id })

    // Save the ticket
    await ticket.save()

    // put "await" because if anything goes wrong while publishing, it will throw an error on this line of code and it will never go down to the "ack" step
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version
    })

    // ack the message
    msg.ack()
  }
}
