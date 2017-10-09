import { createStore } from 'redux'
import rootReducer from './reducers'
import * as actionCreators from './actions'

const store = createStore( rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__( { actionCreators } ) )

export default store