import React from "react"
import PropTypes from "prop-types"
import ChartStock from './chartStock'
import QueryData from "../../utils/apolloQuery"
import { graphql } from 'react-apollo'

var config
var stocks
var indicatorNames = ""

/* connect query and component */
var ChartStockWithDataComp

/* convert Json array from server according to the convention of stockchart UI */
function parseData( data ){

    var result = [];

    for(var i=0; i<data.length; i++){
        var date = new Date( parseInt( data[i].timestamp, 10 ) )
        result[i] = {'date': date , 'open': data[i].open, 'high': data[i].high, 'low': data[i].low, 
                     'close': data[i].close, 'volume': data[i].volume, 'indicators': JSON.parse( data[i].indicators ).i1d }
    }

    return result;
}

/* chartComponent with data from server */
const ChartStockWithData = ( {data : { loading, error, marketIndicators, chartConfig } } ) => {

    /* define inline style */
    var style = {
        color: 'white',
        height: '91vh'
    }

    if( error ){
      return <p style={ style }>{ error.message }</p>
    }
    if( loading ){
      return <p style={ style }>Loading...</p>
    }
    if( parseData( marketIndicators ).length === 0 ){
        return <p style={ style }>No Data</p>
    }
    return (
        <ChartStock type='hybrid' data={ { marketData: parseData( marketIndicators ) , panelInfo: chartConfig.panels } } config={ config } marketName={ stocks.name }/>
    )
}

class Chart extends React.Component {

	static propTypes = {
        config: PropTypes.object.isRequired,
        stocks: PropTypes.object.isRequired
    }
    
    render() {
        config = this.props.config
        stocks = this.props.stocks
        indicatorNames = this.props.data

        ChartStockWithDataComp = graphql( QueryData( stocks.start_date, stocks.market_id, stocks.broker_id, stocks.strategy_id, indicatorNames ) )( ChartStockWithData )
		return (
			<ChartStockWithDataComp/>
		)
	}
}

export default Chart