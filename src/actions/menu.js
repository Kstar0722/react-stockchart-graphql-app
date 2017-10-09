import * as Types from '../constants/menu'

export const showVolume = () => ( { type: Types.SHOW_VOLUME } );
export const showVolumeProfile = () => ( { type: Types.SHOW_VOLUME_PROFILE } );
export const showVolumeProfileBySession = () => ( { type: Types.SHOW_VOLUME_PROFILE_BY_SESSION } );
export const changeThemeStyle = () => ( { type: Types.CHANGE_THEME_STYLE } );
export const changeChartType = ( chartType ) => ( { type: Types.CHANGE_CHART_TYPE, chartType } );
export const shareStart = (  ) => ( { type: Types.SHARE_START } );
export const shareEnd = ( url ) => ( { type: Types.SHARE_END, url } );
export const shareFinished = ( url ) => ( { type: Types.SHARE_FINISHED } );