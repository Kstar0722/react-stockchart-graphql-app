import * as Search from '../constants/search'
  
const initialState = {
    name : localStorage.getItem( 'name' ),
    start_date : localStorage.getItem( 'startDate' ),
    market_id : localStorage.getItem( 'marketID' ),
    broker_id : localStorage.getItem( 'brokerID' ),
    strategy_id : localStorage.getItem( 'strategyID' )
}

export default function reducer ( state = initialState, action ) {
    switch ( action.type ) {

        case Search.SEARCH_ITEM_CLICKED:

            var newState = Object.assign( {}, state )

            newState.name = action.name
            newState.start_date = action.start_date
            newState.market_id = action.market_id
            newState.broker_id = action.broker_id
            newState.strategy_id = action.strategy_id

            localStorage.setItem( 'name', action.name )
            localStorage.setItem( 'startDate', action.start_date )
            localStorage.setItem( 'marketID', action.market_id )
            localStorage.setItem( 'brokerID', action.broker_id )
            localStorage.setItem( 'strategyID', action.strategy_id )

            return newState

        default:
            return state
    }
}
