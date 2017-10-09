import * as Menu from '../constants/menu'
import * as ChartType from '../constants/chartType'
  
const initialState = {
    showVolume: localStorage.getItem( 'volumeChecked' ) === 'true',
    showVolumeProfile: localStorage.getItem( 'volumeProfileChecked' ) === 'true',
    showVolumeProfileBySession: localStorage.getItem( 'volumeProfileBySessionChecked' ) === 'true',
    themeStyle: localStorage.getItem( 'themeStyle' ) === 'true',  // dark: false, light:true
    chartType: localStorage.getItem( 'chartType' ) === null ? ChartType.CHART_CANDLESTICK : localStorage.getItem( 'chartType' ),
    shareUrl: ""
}

export default function reducer ( state = initialState, action ) {
    switch ( action.type ) {

        case Menu.SHOW_VOLUME:
            var newState = Object.assign( {}, state )
            newState.showVolume = !newState.showVolume
            return newState

        case Menu.SHOW_VOLUME_PROFILE:
            newState = Object.assign( {}, state )
            newState.showVolumeProfile = !newState.showVolumeProfile
            return newState
        
        case Menu.SHOW_VOLUME_PROFILE_BY_SESSION:
            newState = Object.assign( {}, state )
            newState.showVolumeProfileBySession = !newState.showVolumeProfileBySession
            return newState
    
        case Menu.CHANGE_THEME_STYLE:
            newState = Object.assign( {}, state )
            newState.themeStyle = !newState.themeStyle
            return newState

        case Menu.CHANGE_CHART_TYPE:
            newState = Object.assign( {}, state )
            newState.chartType = action.chartType
            return newState

        case Menu.SHARE_START:
            newState = Object.assign( {}, state )
            newState.shareUrl = "Uploading ... "
            return newState
    
        case Menu.SHARE_END:
            newState = Object.assign( {}, state )
            newState.shareUrl = action.url
            return newState

        case Menu.SHARE_FINISHED:
            newState = Object.assign( {}, state )
            newState.shareUrl = ""
            return newState
        default:
            return state
    }
}
