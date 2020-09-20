import { useState } from 'react'
import Router from 'next/router'
import useRequest from '../../hooks/use-request'

export default () => {
  const [{ email, password }, setCredentials] = useState({ email: '', password: '' })
  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: {
      email, password
    },
    onSuccess: () => Router.push('/')
  })

  const onSubmit = async e => {
    e.preventDefault()
    await doRequest()
  }

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={e => {
            e.persist()
            setCredentials(cs => ({ ...cs, email: e.target.value }))
          }}/>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => {
            e.persist()
            setCredentials(cs => ({ ...cs, password: e.target.value }))
          }}/>
      </div>
      {errors}
      <button className="btn btn-primary">Sign Up</button>
    </form>
  )
}
