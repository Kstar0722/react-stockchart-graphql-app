import React, { Component } from "react"
import PropTypes from "prop-types"
import { 
    Navbar, Nav, NavDropdown, NavItem,
    DropdownToggle, DropdownMenu, DropdownItem } 
from "reactstrap"

import "./header.css"
import $ from 'jquery'
import SearchBox from '../../component/SearchBox'
import * as Menu from '../../constants/menu'
import * as ChartType from '../../constants/chartType'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { QueryShare } from "../../utils/apolloQuery"
import { graphql } from 'react-apollo'

var delayTimer

/*
    share button for UI
    send image data to server from canvas when share button is clicked
    apollo mutation is used
*/
class Share extends Component {

    static propTypes = {
        mutate: PropTypes.func.isRequired,
        stocks: PropTypes.object.isRequired
    }

    getData() {
        var canvas = $(document).find('#axes').get(0)
        var context = canvas.getContext("2d")

        var resizedCanvas = document.createElement("canvas");
        var resizedContext = resizedCanvas.getContext("2d");
        
        resizedCanvas.height = canvas.height
        resizedCanvas.width = canvas.width

        if ( localStorage.getItem( 'themeStyle' ) === 'true' ){
            resizedContext.fillStyle = "white"
        } else {
            resizedContext.fillStyle = "#1c2a35"
        }
        resizedContext.fillRect( 0, 0, canvas.width, canvas.height )
        
        resizedContext.drawImage(canvas, 0, 0)
        return resizedCanvas.toDataURL()
    }

    onClick() {
        const { stocks, actions } = this.props

        actions.shareStart()
        var data = {
                        broker: stocks.broker_id,
                        strategy: stocks.strategy_id,
                        market: stocks.market_id,
                        interval: '1d',
                        data: this.getData()
                    }

        this.props.mutate({
            variables: { data: data }
        })
        .then( ({ data }) => {
            actions.shareEnd( data.createChartImage.url )
        } )
        .catch( ( error ) => {
            console.log( error )
        })
    }

    render() {
        return <label onClick={ this.onClick.bind(this) }>Share</label>
    }
}

const ShareButton = graphql( QueryShare )( Share )

class Header extends Component {

    static propTypes = {
        actions: PropTypes.object.isRequired,
        config: PropTypes.object.isRequired,
        stocks: PropTypes.object.isRequired
    }

    constructor(props) {
        super( props )

        this.onDisplay = this.onDisplay.bind( this )
        this.focusOnSearch = this.focusOnSearch.bind( this )
        this.blurOnSearch = this.blurOnSearch.bind( this )
        this.inputOnSearch = this.inputOnSearch.bind( this )
        this.focusOnSearchPanel = this.focusOnSearchPanel.bind( this )
        this.hoverOnSearchPanel = this.hoverOnSearchPanel.bind( this )
        this.hoverOutSearchPanel = this.hoverOutSearchPanel.bind( this )
        this.setSearchKey = this.setSearchKey.bind( this )
        this.showShareDialog = this.showShareDialog.bind( this )
        this.hideShareDialog = this.hideShareDialog.bind( this )
        this.state = {
            dropDownOpen: false,
            searchExpanded: true,
            searchKey: localStorage.getItem( 'searchKey' )
        }

        $("#searchInput").val( localStorage.getItem( 'searchKey' ) )
    }

    componentDidMount() {
        $("#searchInput").val( this.state.searchKey )
        $('#searchPanel').attr('tabindex',-1).hover( this.hoverOnSearchPanel, this.hoverOutSearchPanel )
        $('#searchPanel').attr('tabindex',-1).focus( this.focusOnSearchPanel )

        /* Get last status */
        $('#volumeId').attr( 'checked', localStorage.getItem( 'volumeChecked' ) === 'true' )
        $('#volumeProfileId').attr( 'checked', localStorage.getItem( 'volumeProfileChecked' ) === 'true' )
        $('#volumeProfileBySessionId').attr( 'checked', localStorage.getItem( 'volumeProfileBySessionChecked' ) === 'true' )
        $('#themeStyleId').attr( 'checked', localStorage.getItem( 'themeStyle' ) === 'true' )

        switch( localStorage.getItem( 'chartType' ) ){
            case ChartType.CHART_CANDLESTICK:
                $('#chartCandlestick').attr( 'checked', true )
                break;
            case ChartType.CHART_HEIKIN_ASHI:
                $('#chartHeikinAshi').attr( 'checked', true )
                break;
            case ChartType.CHART_KAGI:
                $('#chartKagi').attr( 'checked', true )
                break;
            case ChartType.CHART_LINE:
                $('#chartLine').attr( 'checked', true )
                break;
            case ChartType.CHART_POINT_FIGURE:
                $('#chartPointFigure').attr( 'checked', true )
                break;
            case ChartType.CHART_RENKO:
                $('#chartRenko').attr( 'checked', true )
                break;
        }
    }

    /* show and hide display menu */
    onDisplay() {
        this.setState( {
            dropDownOpen: !this.state.dropDownOpen
        } )
    }

    /* change chart preference */
    onChartPreference( action ) {
        const { actions } = this.props

        switch( action ) {
            case Menu.SHOW_VOLUME:
                actions.showVolume()
                localStorage.setItem( 'volumeChecked', $('#volumeId').is(':checked') )
                break;
            case Menu.SHOW_VOLUME_PROFILE:
                actions.showVolumeProfile()
                localStorage.setItem( 'volumeProfileChecked', $('#volumeProfileId').is(':checked') )
                break;
            case Menu.SHOW_VOLUME_PROFILE_BY_SESSION:
                actions.showVolumeProfileBySession()
                localStorage.setItem( 'volumeProfileBySessionChecked', $('#volumeProfileBySessionId').is(':checked') )
                break;
            case Menu.CHANGE_THEME_STYLE:
                actions.changeThemeStyle()
                localStorage.setItem( 'themeStyle', $('#themeStyleId').is(':checked') )
                break;
            default:
                break;
        }
    }

    /* change chart style */
    onChartStyle( chartType ) {
        const { actions } = this.props
        actions.changeChartType( chartType )
        localStorage.setItem( 'chartType', chartType )
    }

    /* focus on input */
    focusOnSearch() {
        $('#searchPanel').show()
        $('#searchInput').css('width','450')
    }

    /* focus leave from input */
    blurOnSearch() {
        if( this.state.searchExpanded === true ) {
            $('#searchInput').css('width','150')
            $('#searchPanel').hide()
        }
    }

    setSearchKey() {
        this.setState( {
            searchKey: $("#searchInput").val()
        } )
        localStorage.setItem( 'searchKey', $("#searchInput").val() )
    }

    /* get search key */
    inputOnSearch() {
        
        clearTimeout( delayTimer );
        delayTimer = setTimeout( this.setSearchKey, 500 );
    }

    /* search panel is in case of expanded */
    hoverOnSearchPanel() {
        if( this.state.searchExpanded === true ) {
            this.setState( {
                searchExpanded: false
            } )
        }
    }

    /* search panel is in case of expanded */
    focusOnSearchPanel() {
        if( this.state.searchExpanded === true ) {
            this.setState( {
                searchExpanded: false
            } )
        }
    }

    /* search panel can be reduced */
    hoverOutSearchPanel() {
        
        if( this.state.searchExpanded === false ) {
            $('#searchInput').focus()
            this.setState( {
                searchExpanded: true
            } )
        }
    }

    /* 
        show and hide shareDialog 
        this is called whenever shareUrl is changed
    */
    showShareDialog() {
        const { config } = this.props

        if( config.shareUrl === "" ){
            return false
        } else {
            return true
        }
    }

    /* set shareUrl to "" when hide shareDialog */
    hideShareDialog() {
        const { actions } = this.props
        actions.shareFinished()
    }

    render() {
        const { actions, config, stocks } = this.props

        return (
            <div className={ config.themeStyle === false ? "header" : "header-light" }>
                {/* shareDialog */}
                <Modal isOpen={ this.showShareDialog() } toggle={ this.hideShareDialog } className={ this.props.className }>
                    <ModalHeader toggle={ this.hideShareDialog }>Uploading Image</ModalHeader>
                    <ModalBody>
                        { config.shareUrl }
                    </ModalBody>
                </Modal>

                <Navbar>
                    <Nav>
                        <NavItem className={ config.themeStyle === false ? "search ml-0" : "search-light ml-0" }>
                            <input 
                                id="searchInput" 
                                type="text" 
                                className={ config.themeStyle === false ? "search-input" : "search-input-light" }
                                placeholder="Search Symbol ... "
                                onFocus={ this.focusOnSearch }
                                onBlur={ this.blurOnSearch }
                                onInput={ this.inputOnSearch }/>
                            <span id="searchIcon" className="fa fa-search" />
                            <div id="searchPanel" className="search-panel">
                                <SearchBox searchKey={ this.state.searchKey } actions={ actions }/>
                            </div>
                        </NavItem>

                        <NavItem className={ config.themeStyle === false ? "share-menu mr-0" : "share-menu-light mr-0" }>
                            <ShareButton stocks={ stocks } actions={ actions }/>
                        </NavItem>

                        <NavDropdown className="ml-0" isOpen={ this.state.dropDownOpen } toggle={ this.onDisplay }>
                            <DropdownToggle nav caret className={ config.themeStyle == false ? 'display-menu' : 'display-menu-light' }>
                                Display
                            </DropdownToggle>
                            <DropdownMenu right>
                            
                                {/* for chart style */}
                                <DropdownItem header >Chart Style</DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }}>
                                        Candlestick
                                        <input
                                            type="radio"
                                            name="style"
                                            id="chartCandlestick"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartStyle( ChartType.CHART_CANDLESTICK ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }}>
                                        Heikin Ashi
                                        <input 
                                            type="radio"
                                            name="style"
                                            id="chartHeikinAshi"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartStyle( ChartType.CHART_HEIKIN_ASHI ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }}>
                                        Kagi
                                        <input 
                                            type="radio"
                                            name="style"
                                            id="chartKagi"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartStyle( ChartType.CHART_KAGI ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }}>
                                        Line
                                        <input 
                                            type="radio"
                                            name="style"
                                            id="chartLine"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartStyle( ChartType.CHART_LINE ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }}>
                                        Point & Figure
                                        <input 
                                            type="radio"
                                            name="style"
                                            id="chartPointFigure"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartStyle( ChartType.CHART_POINT_FIGURE ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }}>
                                        Renko
                                        <input 
                                            type="radio"
                                            name="style"
                                            id="chartRenko"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartStyle( ChartType.CHART_RENKO ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem divider />

                                {/* for chart preferencer */}
                                <DropdownItem header >Chart Preferences</DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }} >
                                        Volume
                                        <input 
                                            type="checkbox" 
                                            id="volumeId" 
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartPreference( Menu.SHOW_VOLUME ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }} >
                                        Volume Profile
                                        <input 
                                            type="checkbox"
                                            id="volumeProfileId"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartPreference( Menu.SHOW_VOLUME_PROFILE ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }} >
                                        Volume Profile By Session
                                        <input 
                                            type="checkbox"
                                            id="volumeProfileBySessionId"
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartPreference( Menu.SHOW_VOLUME_PROFILE_BY_SESSION ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem divider />

                                {/* for theme */}
                                <DropdownItem header >Theme</DropdownItem>
                                <DropdownItem>
                                    <label className="form-check-label" style={{ width: "270px" }} >
                                        Light Theme
                                        <input 
                                            type="checkbox" 
                                            id="themeStyleId" 
                                            style={ { float: "right", "marginTop": "3px", "marginLeft": "40px", color: "#0000FF" } }
                                            onClick={ e => this.onChartPreference( Menu.CHANGE_THEME_STYLE ) }/>
                                    </label>
                                </DropdownItem>
                                <DropdownItem divider />
                            </DropdownMenu>
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

export default Header;