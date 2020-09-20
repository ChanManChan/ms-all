// @ts-nocheck


//! To associate an existing Order and Ticket together
const ticket = await Ticket.findOne({})
const order = await Order.findOne({})

order.ticket = ticket
await order.save()


//! To associate an existing Ticket with a *new* Order
const ticket = await Ticket.findOne({})
const order = Order.build({
  ticket: ticket,
  userId: '...',
  status: OrderStatus.Created,
  expiresAt: tomorrow
})
await order.save()

//!  To fetch an existing Order from the database with its associated Ticket
const order = await Order.findById('...').populate('ticket')
