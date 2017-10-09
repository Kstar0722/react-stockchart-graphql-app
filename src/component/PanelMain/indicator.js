import React from 'react'

import { format } from "d3-format"
import { timeFormat } from "d3-time-format"

import { Chart } from "react-stockcharts"
import { Label } from "react-stockcharts/lib/annotation"
import { XAxis, YAxis } from "react-stockcharts/lib/axes"
import { BarSeries, LineSeries } from "react-stockcharts/lib/series"
import { SingleValueTooltip } from "react-stockcharts/lib/tooltip"
import { MouseCoordinateX, MouseCoordinateY } from "react-stockcharts/lib/coordinates"

/* represent a indicator */
const Indicator = ( panelInfo, centerX, indicatorDefaultIndex, config ) => {
    return ( panelInfo.map( ( entry, index ) => {

        /* hide default indicator panel */
        if( index === indicatorDefaultIndex ){
            return (
                <Chart key={ index } yExtents={ d => d.open } height={ 0 }>
                </Chart>
            )
        }

        /* calculate the start height of each panels except default indicator panel */
        const startHeight = 470 + 140 * ( index < indicatorDefaultIndex ? index : index - 1 )
        return (
            <Chart key={ index } id={ index+3 }
                yExtents={ d => {
                        /* calculate min and max value at the point, so Y axis are determined by this value */
                        var start = d.indicators[ entry.indicators[0].name ], end = d.indicators[ entry.indicators[0].name ]
                        for( var i=1; i<entry.indicators.length; i++ ){
                            start = Math.min( d.indicators[ entry.indicators[i].name ], start )
                            end = Math.max( d.indicators[ entry.indicators[i].name ], end )
                        }

                        return [ parseInt( start, 10 ), parseInt( end, 10 )  ]
                    }
                }
                height={ 120 } origin={ (w, h) => [0, startHeight] } padding={ { top: 20, bottom: 20 } }
            >
                <XAxis axisAt="bottom" orient="bottom" showTicks={ false } 
                    stroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
                    tickStroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
                    opacity={ 0.7 }/>
                <YAxis axisAt="right" orient="right" ticks={ 3 } 
                    stroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
                    tickStroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
                    opacity={ 0.7 }/>

                <MouseCoordinateX
                    at="bottom"
                    orient="bottom"
                    displayFormat={ timeFormat("%Y-%m-%d") } />
                <MouseCoordinateY
                    at="right"
                    orient="right"
                    displayFormat={ format(".2f") } />

                {/* Group several indicators into one panel */}
                { entry.indicators.map( (item, index) => {
                    const name = item.name
                    const type = item.type
                    const style = item.style == null ? 'Solid' : item.style
                    const color = item.color == null ? '#6BA583' : item.color
                    const width = item.width

                    if( type === 'bar' ){
                        return(
                            <BarSeries
                                key={ index }
                                fill={ color }
                                yAccessor={ d => d.indicators[ name ] } />
                        )
                    }
                    return(
                        <LineSeries 
                            key={ index } 
                            yAccessor={ d => d.indicators[ name ] } 
                            className={ type }
                            stroke={ color } 
                            strokeWidth={ width }
                            strokeDasharray = { style }
                        />
                    )
                } ) }

                { entry.indicators.map( (item, index) => {
                    const name = item.name
                    //const color = item.color == null ? '#FFFFFF' : item.color
                    return (
                        <SingleValueTooltip
                            key={ index }
                            yAccessor={ d => d.indicators[ name ] }
                            yLabel={ name }
                            yDisplayFormat={ format(".2f") }
                            origin={ [-40, 10 + index * 16] }
                            valueStroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
                            labelStroke={ config.themeStyle == false ? "#FFFF00" : "#4682b4" }
                            fontSize={ 13 }
                        />
                    )
                } ) }

                {/* label for indicator type */}
                <Label x={ centerX } y={ startHeight + 10 }
					fontSize="15" text={ entry.name.toUpperCase() } 
                    fill={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
                    opacity={ 0.6 }/>
            </Chart>
        )})
    )
}


export default Indicator;