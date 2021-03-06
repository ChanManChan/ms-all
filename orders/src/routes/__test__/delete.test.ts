import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'
import { Order, OrderStatus } from '../../models/order'
import { natsWrapper } from '../../nats-wrapper'
import mongoose from 'mongoose'

it('marks an order as cancelled', async () => {
  // create a ticket
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'random-title',
    price: 20
  })
  await ticket.save()

  const user = global.signin()

  // make a request to create an order
  const { body: order } = await request(app)
     .post('/api/orders')
     .set('Cookie', user)
     .send({ ticketId: ticket.id })
     .expect(201)

  // make a request to cancel an order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // expectation to make sure its cancelled
  const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('emits an order cancelled event', async () => {
  const ticket = Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'random-title',
    price: 20
  })
  await ticket.save()

  const user = global.signin()

  const { body: order } = await request(app)
     .post('/api/orders')
     .set('Cookie', user)
     .send({ ticketId: ticket.id })
     .expect(201)

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2)
})
