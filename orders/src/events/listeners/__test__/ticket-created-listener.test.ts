import { TicketCreatedListener } from '../ticket-created-listener'
import { natsWrapper } from '../../../nats-wrapper'
import { TicketCreatedEvent } from '@nandagopalms/common'
import mongoose from 'mongoose'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../../models/ticket'

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: 'test-title',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    // jest.fn() === mock function === keeps track of how many times it gets called and the arguments provided to it
    ack: jest.fn()
  }

  return { listener, data, msg }
}

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup()
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)
  // write assertions to make sure a ticket was created
  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)
})

it('acks the message', async () => {
  // call the onMessage function with the data object + message object
  const { listener, data, msg } = await setup()
  // write assertions to make sure a ticket was created
  await listener.onMessage(data, msg)
  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled()
})
