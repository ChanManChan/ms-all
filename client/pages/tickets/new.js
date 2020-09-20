import { useState } from 'react'
import useRequest from '../../hooks/use-request'
import Router from 'next/router'

const NewTicket = () => {
  const [{ title, price }, setLvalues] = useState({
    title: '',
    price: ''
  })


  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title, price
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = (e) => {
    e.preventDefault()
    doRequest()
  }


  const onBlur = () => {
    const value = parseFloat(price)

    if(isNaN(value))
      return

    setLvalues(cs => ({...cs, price: value.toFixed(2)}))
  }

  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input type="text" className="form-control" value={title} onChange={e => {
            e.persist()
            setLvalues(cs => ({...cs, title: e.target.value}))
          }}/>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input type="number" className="form-control" value={price} onBlur={onBlur} onChange={e => {
            e.persist()
            setLvalues(cs => ({...cs, price: e.target.value}))
          }}/>
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default NewTicket
