import Link from 'next/link'
// import buildClient from '../api/build-client'

const LandingPage = ({ currentUser, tickets }) => {
  // request from inside the browser
  // await axios.get('/api/users/currentuser')

  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ))

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
}

// NextJS is going to call this function while it is attempting to render our application on the server
LandingPage.getInitialProps = async (context, client, currentUser) => {
    // request from inside the server therefore reach to Ingress-nginx
    // k get namespace
    // k get services -n ingress-nginx
    // const { data } = await axios.get('http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', {
      // headers: {
      //   Host: 'ticketing.dev'
      // }
      // headers: req.headers
    // })
    // Reach directly to Auth service when on the browser
    //! --------------------
    // const { data } = await buildClient(context).get('/api/users/currentuser')
    const { data } = await client.get('/api/tickets')
    return { tickets: data }
}

export default LandingPage

// Cross namespace communication uses a different pattern
// http://NAMEOFSERVICE.NAMESPACE.svc.cluster.local

// From client to Ingress-nginx request (Cross namespace communication)
// http://ingress-nginx-controller.ingress-nginx.svc.cluster.local


//! Request from a component == Always issued from the browser, so use a domain of ""
//! Request from getInitialProps == Might be executed from the client or the server! Need to figure out what our env is so we can use the correct domain


//? When getInitialProps called ?
//! Request Source
//1> Hard refresh of page                 <- getInitialProps executed on the server
//2> Clicking link from different domain  <- getInitialProps executed on the server
//3> Type URL into address bar            <- getInitialProps executed on the server

// 4> Navigating from one page to another while in the app <- getInitialProps executed on the client
