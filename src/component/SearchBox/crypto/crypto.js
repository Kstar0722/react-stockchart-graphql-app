import React from 'react'
import PropTypes from "prop-types"
import { graphql } from 'react-apollo'
import { QuerySearch } from "../../../utils/apolloQuery"

import $ from 'jquery'
import './crypto.css'

/* chartComponent with data from server */
/*
const Table = ( {data : { loading, error, markets } } ) => {
    if( error ){
      return <p>{ error.message }</p>
    }
    if( loading ){
      return <p>Loading...</p>
    }

    return (
        <table id="searchAllTable" className="table search-table table-hover">
            <tbody>
                {
                    markets.map( ( item, index ) => { 
                        const symbol = item.symbol == null ? "" : item.symbol
                        const name = item.name == null ? "" : item.name
                        const exchange = item.exchange == null ? "" : item.exchange.name
                        return (
                            <tr key={ index } onClick={ e => console.log('aaa') }>
                                <td className="col1">{ symbol }</td>
                                <td className="col2">{ name }</td>
                                <td className="col3">{ exchange }</td>
                            </tr>
                        )
                     } )
                }
            </tbody>
        </table>
    )
}
*/

var actions
var markets = []
var TableWithData

class Table extends React.Component {

    static propTypes = {
		data: PropTypes.object.isRequired
    }

    render() {
        markets = this.props.data.markets === undefined ? [] : Object.values( this.props.data.markets )
        /* filter futures data */
        markets = markets.filter( (item) => { 
            /* if type is not specified, return false */
            if( item.type === null ){
                return false
            }
            /* if type is same as search tab, return true */
            if( item.type === "crypto" ){
                return true
            }
            return false
         } )
        return (
            <table id="searchAllTable" className="table search-table table-hover">
                <tbody>
                    {
                        markets.map( ( item, index ) => { 
                            const symbol = item.symbol == null ? "" : item.symbol
                            const name = item.name == null ? "" : item.name
                            const exchange = item.exchange == null ? "" : item.exchange.name
                            const market_id = item.id === null ? "" : item.id
                            const broker_id = item.brokers === null ? "" : item.brokers[0].id
                            const strategy_id = item.strategies === null ? "" : item.strategies[0].id
                            return (
                                <tr key={ index } onClick={ e => actions.searchItemClicked(name, "1970-01-01", market_id, broker_id, strategy_id) }>
                                    <td className="col1">{ symbol }</td>
                                    <td className="col2">{ name }</td>
                                    <td className="col3">{ exchange }</td>
                                </tr>
                            )
                        } )
                    }
                </tbody>
            </table>
        )
    }
}

class Crypto extends React.Component {

    static propTypes = {
        searchKey: PropTypes.string,
		actions: PropTypes.object.isRequired        
    }

    componentDidMount() {
    }
    
    render() {
        actions = this.props.actions
        if( this.props.searchKey !== null ) {
            TableWithData = graphql( QuerySearch( this.props.searchKey ) )( Table )
        } else {
            TableWithData = () => { return <div/> }
        }
		return (
			<TableWithData />
		)
    }
}

export default Crypto;