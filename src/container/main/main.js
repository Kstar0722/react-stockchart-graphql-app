import React, { Component } from 'react'
import PropTypes from "prop-types"
import ChartMain from '../.././component/PanelMain'
import './main.css'

class Main extends Component {

  static propTypes = {
    config: PropTypes.object.isRequired,
    stocks: PropTypes.object.isRequired
  }

  render() {
    const { config, stocks } = this.props
    return (
      <div className="container-fluid chart-container-div">
        <div className="row chart-row-div">
          <div className={ config.themeStyle == false ? "col-sm-12 chart-div" : "col-sm-12 chart-div-light" }>
            <ChartMain config={ config } stocks={ stocks }/>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;