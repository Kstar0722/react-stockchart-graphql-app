import * as Types from '../constants/search'

export const searchItemClicked = ( name, start_date, market_id, broker_id, strategy_id ) => ( { type: Types.SEARCH_ITEM_CLICKED, name, start_date, market_id, broker_id, strategy_id } )