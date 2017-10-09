import React from 'react'
import $ from 'jquery'
import PropTypes from "prop-types"

import './index.css'
import All from './all/all.js'
import Stock from './stock/stock.js'
import Forex from './forex/forex.js'
import Index from './indexes/indexes.js'
import CFD from './cfd/cfd.js'
import Futures from './futures/futures.js'
import Crypto from './crypto/crypto.js'

class SearchBox extends React.Component {

	static propTypes = {
		searchKey: PropTypes.string,
		actions: PropTypes.object.isRequired
	}

	render() {
		const { actions } = this.props
		return (
			<div className="search-box">
				<ul className="nav nav-tabs" role="tablist">
					<li className="nav-item">
						<a className="nav-link active" href="#search_all" role="tab" data-toggle="tab">ALL</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#search_stocks" role="tab" data-toggle="tab">STOCK</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#search_fx" role="tab" data-toggle="tab">FOREX</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#search_indexes" role="tab" data-toggle="tab">INDEX</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#search_funds" role="tab" data-toggle="tab">CFD</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#search_futures" role="tab" data-toggle="tab">FUTURES</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#search_crypto" role="tab" data-toggle="tab">CRYPTO</a>
					</li>
				</ul>

				<div className="tab-content">
					<div role="tabpanel" className="tab-pane fade in active" id="search_all">
						<All searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
					<div role="tabpanel" className="tab-pane fade" id="search_stocks">
						<Stock searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
					<div role="tabpanel" className="tab-pane fade" id="search_fx">
						<Forex searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
					<div role="tabpanel" className="tab-pane fade" id="search_indexes">
						<Index searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
					<div role="tabpanel" className="tab-pane fade" id="search_funds">
						<CFD searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
					<div role="tabpanel" className="tab-pane fade" id="search_futures">
						<Futures searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
					<div role="tabpanel" className="tab-pane fade" id="search_crypto">
						<Crypto searchKey={ this.props.searchKey } actions={ actions }/>
					</div>
				</div>
			</div>
		)
	}
}

export default SearchBox;