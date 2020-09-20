import { useEffect, useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0)
  const [description, setDescription] = useState('')
  const { doRequest, errors } = useRequest({
    url: '/api/payments',
    method: 'post',
    body: {
      orderId: order.id,
      description
    },
    onSuccess: () => Router.push('/orders')
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date()
      setTimeLeft(Math.round(msLeft / 1000))
    }

    // manually invoke "findTimeLeft" <- so that timeleft is calculated immediately
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)

    return () => {
      clearInterval(timerId)
    }

  }, [order])

  if(timeLeft < 0)
    return <h2>Order Expired</h2>

  return (
    <div>
      <h2>Time left to pay: {timeLeft} seconds</h2>
      <div className="form-group">
        <label>Description</label>
        <input type="text" className="form-control" value={description} onChange={e => setDescription(e.target.value)} required/>
      </div>
      <StripeCheckout
        token={({ id }) => doRequest({ token: id })}
        stripeKey="pk_test_51HT4LqIw5hy1Di85hMlzkaRYnEGoq77HJVvEvm6qmppF03E5aJXToSkdjjZk0KD7F56NgLRwOGfFXPVKreFA6Yb500m7YXOhOl"
        amount={order.ticket.price * 100}
        email={currentUser.email}
        />
        {errors}
    </div>
  )
}

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query

  const { data } = await client.get(`/api/orders/${orderId}`)

  return { order: data }
}

export default OrderShow
