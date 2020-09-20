import { Message, Stan } from 'node-nats-streaming'
import { Subjects } from './subjects'

interface Event {
  subject: Subjects;
  data: any;
}

// Blueprint on how to create a listener
export abstract class Listener<T extends Event> {
  // Name of the channel this listener is going to listen to
  abstract subject: T['subject']
  // Name of the queue group this listener will join
  abstract queueGroupName: string
  // Number of seconds this listener has to ack a message
  protected ackWait: number = 5 * 1000
  // Pre-initialized NATS client
  protected client: Stan

  // Function to run when a message is received
  abstract onMessage(data: T['data'], msg: Message): void

  constructor(client: Stan) {
    this.client = client
  }

  // Default subscription options
  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName)
  }

  // Code to set up the subscription
  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    )
      subscription.on('message', (msg: Message) => {
        console.log(
          `Event received: ${this.subject} / ${this.queueGroupName}`
        )
        const parsedData = this.parseMessage(msg)
        this.onMessage(parsedData, msg)
      })
  }

  // Helper function to parse a message
  parseMessage(msg: Message) {
    const data = msg.getData()
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'))
  }
}
