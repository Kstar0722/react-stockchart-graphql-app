import React from 'react'
import PropTypes from "prop-types"
import Chart from './chart'
import { QueryChartConfig } from "../../utils/apolloQuery"
import { graphql } from 'react-apollo'

var config
var stocks

/* chartComponent with data from server */
const ChartWithConfig = ( {data : { loading, error, chartConfig } } ) => {

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
	
	var indicatorNames = ""
	/* get indicator names from QueryChartConfig */
	for( var i=0; i<chartConfig.panels.length; i++ ){
		for( var j=0; j<chartConfig.panels[i].indicators.length; j++ ){
			indicatorNames = indicatorNames + chartConfig.panels[i].indicators[j].name + ","
		}
	}

	indicatorNames = indicatorNames.substring( 0, indicatorNames.length - 1 )

    return (
        <Chart data={ indicatorNames } config={ config } stocks={ stocks }/>
    )
}

/* connect query and component */


class ChartMain extends React.Component {

	static propTypes = {
		config: PropTypes.object.isRequired,
		stocks: PropTypes.object.isRequired
	}

	componentDidMount() {
	}

	render() {
		config = this.props.config
		stocks = this.props.stocks

		const ChartWithConfigComp = graphql( QueryChartConfig( stocks.strategy_id ) )( ChartWithConfig )
		return (
			<ChartWithConfigComp/>
		)
	}
}

export default ChartMain;