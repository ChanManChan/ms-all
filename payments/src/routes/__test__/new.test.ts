import { stripe } from '../../stripe'
import { Order } from '../../models/order'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../app'
import { OrderStatus } from '@nandagopalms/common'
import { Payment } from '../../models/payment'

// jest.mock('../../__mocks__/stripe.ts')

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'random-token',
      orderId: mongoose.Types.ObjectId().toHexString()
    })
    .expect(404)
})

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })

  await order.save()

  await request(app)
  .post('/api/payments')
  .set('Cookie', global.signin())
  .send({
    token: 'random-token',
    orderId: order.id
  })
  .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'random-token'
    })
    .expect(400)
})

it('returns a 201 with valid inputs', async () => {
  const userId = mongoose.Types.ObjectId().toHexString()
  const randomPriceForTest = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: randomPriceForTest,
    status: OrderStatus.Created
  })

  await order.save()

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    })
    .expect(201)

  const stripeCharges = await stripe.charges.list({ limit: 50 })

  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === randomPriceForTest * 100
  })

  expect(stripeCharge).toBeDefined()
  expect(stripeCharge!.currency).toEqual('inr')

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

  //   expect(chargeOptions.source).toEqual('tok_visa')
  //   expect(chargeOptions.amout).toEqual(20 * 100)
  //   expect(chargeOptions.currency).toEqual('inr')

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge!.id
  })

  expect(payment).not.toBeNull()
})
