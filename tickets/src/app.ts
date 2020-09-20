import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@nandagopalms/common'

import { showTicketRouter } from './routes/show'
import { createTicketRouter } from './routes/new'
import { indexTicketRouter } from './routes'
import { updateTicketRouter } from './routes/update'

const app = express()
// 'trust proxy' <- for ingress nginx
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: false
    // secure: process.env.NODE_ENV !== 'test'
  })
);

// if the user is authenticated, it will set the req.currentUser property
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
