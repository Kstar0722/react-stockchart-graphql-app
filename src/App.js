import React, { Component } from 'react'
import PropTypes from "prop-types"
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import './styles/style.css'
import Main from './container/main/main'
import Header from './container/header/header'
import * as Actions from './actions';

import Apollo from './utils/apolloService'
import { ApolloProvider } from 'react-apollo'

class App extends Component {
  
  render() {
    const { config, stocks, actions } = this.props
    return (
      <ApolloProvider client={ Apollo }>
        <div className={ config.themeStyle == false ? 'main-div' : 'main-div-light' }>
          <Header actions={ actions } config={ config } stocks={ stocks }/>
          <Main config={ config } stocks={ stocks }/>
        </div>
      </ApolloProvider>
    )
  }
}

App.propTypes = {
  config: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  config: state.menu,
  stocks: { 
            name: state.search.name,
            start_date: state.search.start_date,
            market_id: state.search.market_id,
            broker_id: state.search.broker_id,
            strategy_id: state.search.strategy_id
          }
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(Actions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);