export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
      // this is the actual function that will be invoked when someone tries to run publish
      callback()
    })
  }
}
