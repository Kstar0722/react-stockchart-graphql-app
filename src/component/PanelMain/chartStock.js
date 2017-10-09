import React from "react"
import PropTypes from "prop-types"
import Indicator from "./indicator"
import * as ChartType from '../../constants/chartType'

import { format } from "d3-format"
import { timeFormat } from "d3-time-format"

import { ChartCanvas, Chart } from "../Stock"
import { Label, LabelAnnotation, Annotate } from "../Stock/Lib/annotation";
import { XAxis, YAxis } from "../Stock/Lib/axes"
import { CrossHairCursor, EdgeIndicator, MouseCoordinateX, MouseCoordinateY } from "../Stock/Lib/coordinates"

import { discontinuousTimeScaleProvider } from "../Stock/Lib/scale"
import { SingleValueTooltip, OHLCTooltip } from "../Stock/Lib/tooltip"
import { change, heikinAshi, kagi, pointAndFigure, renko } from "../Stock/Lib/indicator";
import { fitWidth } from "../Stock/Lib/helper"
import { last } from "../Stock/Lib/utils"
import { ClickCallback } from "../Stock/Lib/interactive"
import { 
	BarSeries, 
	LineSeries, 
	VolumeProfileSeries, 
	CandlestickSeries, 
	KagiSeries,
	PointAndFigureSeries,
	RenkoSeries } 
from "../Stock/Lib/series"

const getDefaultIndicatorIndex = () => {
	return 1
}

class ChartStock extends React.Component { 
	render() { 

		const { type, data: initialData, width, ratio, config } = this.props;

		/*  
			get index of default indicator panel if exist
			return -1 if it doesn't exist
		*/
		const indicatorDefaultIndex = getDefaultIndicatorIndex()

		/* height of main chart */
		const chartHeight = 450

		/* calculate of the height of whole panel ( main chart + additional panels ) */
		const panelNum = indicatorDefaultIndex === -1 ? ( initialData.panelInfo.length  ) : ( initialData.panelInfo.length - 1 )
		const height = chartHeight + 100 + panelNum * 140;

		/* margin of main chart */
		const margin = { left: 80, right: 80, top: 30, bottom: 50 };

		/* Y axis label position
		const [ yAxisLabelX, yAxisLabelY ] = [
			width - margin.left - 20,
			( height - margin.top - margin.bottom ) / 2
		];
		*/

		/* calculate volume profile Y axis */
		var calculatedData
		const changeCalculator = change();

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor( d => d.date );
		
		switch( config.chartType ) {
			case ChartType.CHART_CANDLESTICK:
			case ChartType.CHART_LINE:
				calculatedData = changeCalculator( initialData.marketData )
				break;
			case ChartType.CHART_HEIKIN_ASHI:
				const heikinCalculator = heikinAshi()
				calculatedData = changeCalculator( heikinCalculator( initialData.marketData ) )
				break;
			case ChartType.CHART_KAGI:
				const kagiCalculator = kagi()
				/* Stock/Lib/calculator/kagi.js is modified; indicators are added */
				calculatedData = changeCalculator( kagiCalculator( initialData.marketData ) )
				break;
			case ChartType.CHART_POINT_FIGURE:
				const pointAndFigureCalculator = pointAndFigure()
				/* Stock/Lib/calculator/pointAndFigure.js is modified; indicators are added */
				calculatedData = changeCalculator( pointAndFigureCalculator( initialData.marketData ) )
				break;
			case ChartType.CHART_RENKO:
				const renkoCalculator = renko()
				/* Stock/Lib/calculator/renko.js is modified; indicators are added */
				calculatedData = changeCalculator( renkoCalculator( initialData.marketData ) )
				break;
			default:
				break;
		}


		const { 
			data,
			xScale,
			xAccessor,
			displayXAccessor,
		 } = xScaleProvider( calculatedData );

		const start = xAccessor( last(data) );
		const end = xAccessor( data[Math.max(0, data.length - 150)] );
		const xExtents = [ start, end ];

		// For Grid
		var gridHeight = chartHeight;
		var gridWidth = width - margin.left - margin.right;
		
		var showGrid = true;
		var yGrid = showGrid ? { 
			innerTickSize: -1 * gridWidth,
			tickStrokeDasharray: 'Solid',
			tickStrokeOpacity: 0.2,
			tickStrokeWidth: 1
		 } : {  };
		var xGrid = showGrid ? { 
			innerTickSize: -1 * gridHeight,
			tickStrokeDasharray: 'Solid',
			tickStrokeOpacity: 0.2,
			tickStrokeHeight: 1
		 } : {  };

		/* text on each candle */
		const defaultAnnotationProps = {
			fontFamily: "Glyphicons Halflings",
			fontSize: 15,
			opacity: 0.8,
			onClick: console.log.bind(console),
		};

		const longAnnotationProps = ( indicatorName, color ) => {
			return {
				...defaultAnnotationProps,
				color: color,
				indicatorName: indicatorName,
				y: ({ yScale, datum }) => {
					if( datum.close > datum.open ){
						return yScale(datum.high) - 10
					} else{
						return yScale(datum.low) + 20
					}
				},
				tooltip: "Go long"
			}
		};

		/*
		const shortAnnotationProps = {
			...defaultAnnotationProps,
			fill: "#E20000",
			text: "\ue094",
			y: ({ yScale, datum }) => yScale(datum.high),
			tooltip: "Go short",
		};
		*/
		return (
			<ChartCanvas height={ height }
					ratio={ ratio }
					width={ width }
					margin={ margin }
					type={ type }
					seriesName="MSFT"
					data={ data }
					xScale={ xScale }
					xAccessor={ xAccessor }
					displayXAccessor={ displayXAccessor }
					xExtents={ xExtents }>

				<Label x={ ( width - margin.left - margin.right ) / 2 } y={ 30 }
					fontSize="30" text={ this.props.marketName === null ? "" : this.props.marketName } 
					fill={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
					opacity={ 0.6 }/>

				<Chart id={ 1 } height={ chartHeight }
						yExtents={ d => {
								/* calculate min and max value at the point, so Y axis are determined by this value */
								var start = d.low, end = d.high
								for( var i=0; i<initialData.panelInfo[ indicatorDefaultIndex ].indicators.length; i++ ){

									if( initialData.panelInfo[ indicatorDefaultIndex ].indicators[i].type === 'text' ){
										continue;
									}
									start = Math.min( d.indicators[ initialData.panelInfo[ indicatorDefaultIndex ].indicators[i].name ], start )
									end = Math.max( d.indicators[ initialData.panelInfo[ indicatorDefaultIndex ].indicators[i].name ], end )
								}
								return [ start, end ]
							}
						}
						padding={ { top: 20, bottom: 20 } }>

					<XAxis axisAt="bottom" orient="bottom" { ...xGrid } 
						stroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
						tickStroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
						opacity={ 0.7 }/>
					<YAxis axisAt="right" orient="right" { ...yGrid } ticks={ 7 } 
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

					{/* X and Y axis label

					<Label x={ (width - margin.left - margin.right) / 2 } y={ height - 35 }
						fontSize="12" text="XAxis Label here" fill="#FFFFFF" opacity={ 0.6 }/>

					<Label x={ yAxisLabelX } y={ yAxisLabelY } rotate={ -90 }
						fontSize="12" text="YAxis Label here"  fill="#FFFFFF" opacity={ 0.6 }/>
					*/}

					{/* candlestick chart type */}
					{ config.chartType === ChartType.CHART_CANDLESTICK ? 
						<CandlestickSeries
							wickStroke={ d => d.close > d.open ? "#6BA583" : "#DB0000" }
							fill={ d => d.close > d.open ? "#6BA583" : "#DB0000" } /> : <div/> }

					{/* heikin ashi chart type */}
					{ config.chartType === ChartType.CHART_HEIKIN_ASHI ? 
						<CandlestickSeries
							wickStroke={ d => d.close > d.open ? "#6BA583" : "#DB0000" }
							fill={ d => d.close > d.open ? "#6BA583" : "#DB0000" } /> : <div/> }
					
					{/* kagi chart type */}
					{ config.chartType === ChartType.CHART_KAGI ? 
						<KagiSeries/> : <div/> }

					{/* line chart type */}
					{ config.chartType === ChartType.CHART_LINE ? 
						<LineSeries
							yAccessor={d => d.open}
							stroke="#ff7f0e"
							strokeDasharray="Solid" /> : <div/> }

					{/* point & figure chart type */}
					{ config.chartType === ChartType.CHART_POINT_FIGURE ? 
						<PointAndFigureSeries /> : <div/> }

					{/* renko chart type */}
					{ config.chartType === ChartType.CHART_RENKO ? 
						<RenkoSeries /> : <div/> }
					
					{/* show default indicators in main chart */}
					{ initialData.panelInfo[ indicatorDefaultIndex ].indicators.map( (item, index) => {
						const name = item.name
						const type = item.type
						const style = item.style == null ? 'Solid' : item.style
						const color = item.color
						const width = item.width

						if( type === 'text' ){
							return(
								<Annotate
									key={ index }
									with={ LabelAnnotation }
									when={ d => d.indicators[ name ] !== "null" }
									usingProps={ longAnnotationProps( name, color ) } />
							)
						} else if( type === 'bar' ){
							return(
								<BarSeries 
									key={ index }
									fill={ color }
									width={ 0.1 }
									yAccessor={ d => d.indicators[ name ] } />
							)
						} else {
							return(
								<LineSeries
									key={ index }
									yAccessor={ d => d.indicators[ name ] }
									stroke={ color }
									strokeWidth={ width }
									strokeDasharray = { style }
								/>
							)
						}
					} ) }

					{/* show default indicators tooltip in main chart */}
					{ initialData.panelInfo[ indicatorDefaultIndex ].indicators.map( (item, index) => {
						const name = item.name
						//const color = item.color == null ? '#FFFFFF' : item.color
						return (
							<SingleValueTooltip
								key={ index }
								yAccessor={ d => d.indicators[ name ] }
								yLabel={ name }
								yDisplayFormat={ format(".2f") }
								origin={ [-40, 30 + index * 16] }
								valueStroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
								labelStroke={ config.themeStyle == false ? "#FFFF00" : "#4682b4" }
								fontSize={ 13 }
							/>
						)
					} ) }

					{/* show volume profile */}
					{ config.showVolumeProfileBySession === true ? 
						<VolumeProfileSeries 
							bySession 
							orient="right" 
							showSessionBackground
							opacity={ 0.4 }
							fill={ d => d.type === "up" ? "#6BA583" : "#DB0000" }/> : <div/>
					}
					
					{/* show volume profile */}
					{ config.showVolumeProfile === true ? 
						<VolumeProfileSeries 
							opacity={ 0.4 }
							fill={ d => d.type === "up" ? "#6BA583" : "#DB0000" }/> : <div/>
					}

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={ d => d.close } fill={ d => d.close > d.open ? "#6BA583" : "#DB0000" }/>

					<OHLCTooltip origin={ [-40, 0] } fontSize={ 13 } 
						labelFill={ config.themeStyle == false ? "#FFFF00" : "#4682b4" }
						textFill={ config.themeStyle == false ? "#FFFFFF" : "#000000" }/>

					{/* click callback */}
					{/*
					<ClickCallback
						onClick={ (moreProps, e) => { 
								console.log("onClick", moreProps, e);
								alert( JSON.stringify( moreProps.currentItem ) )
							} 
						}
					/>
					*/}
				</Chart>

				{/* show volume */}
				{ config.showVolume === true ? 
					<Chart id={ 2 }
						yExtents={ [d => d.volume] }
						height={ 120 } origin={ (w, h) => [0, chartHeight - 120] }>
						<YAxis axisAt="left" orient="left" ticks={ 5 } tickFormat={ format(".0s") } 
							tickStroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
							opacity={ 0.7 }/>
						<MouseCoordinateY
							at="left"
							orient="left"
							displayFormat={ format(".4s") } />

						<BarSeries yAccessor={ d => d.volume }
								widthRatio={ 0.8 }
								opacity={ 0.3 }
								fill={ d => d.close > d.open ? "#6BA583" : "#DB0000" } />
					</Chart> : <div/> }

				{ Indicator( initialData.panelInfo, ( width - margin.left - margin.right ) / 2, indicatorDefaultIndex, config ) }
				
				<CrossHairCursor strokeDasharray="ShortDash" 
					stroke={ config.themeStyle == false ? "#FFFFFF" : "#000000" } 
					opacity={ 0.7 } />

			</ChartCanvas>
		);
	 }
 }

 ChartStock.propTypes = { 
	data: PropTypes.object.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
	config: PropTypes.object.isRequired,
	marketName: PropTypes.string.isRequired
 };

 ChartStock.defaultProps = { 
	type: "svg",
 };
 ChartStock = fitWidth(ChartStock);

export default ChartStock;