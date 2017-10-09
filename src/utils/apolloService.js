import { ApolloClient, createNetworkInterface } from 'react-apollo'

const networkInterface = createNetworkInterface({
    uri: 'https://jackbot.io/api/'
  })
  
const Apollo = new ApolloClient({
    networkInterface: networkInterface
})

export default Apollo
