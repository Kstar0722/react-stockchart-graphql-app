"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _d3Array = require("d3-array");

var _d3Path = require("d3-path");

var _GenericChartComponent = require("../../GenericChartComponent");

var _GenericChartComponent2 = _interopRequireDefault(_GenericChartComponent);

var _GenericComponent = require("../../GenericComponent");

var _StraightLine = require("./StraightLine");

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var GannFan = function (_Component) {
	_inherits(GannFan, _Component);

	function GannFan(props) {
		_classCallCheck(this, GannFan);

		var _this = _possibleConstructorReturn(this, (GannFan.__proto__ || Object.getPrototypeOf(GannFan)).call(this, props));

		_this.renderSVG = _this.renderSVG.bind(_this);
		_this.drawOnCanvas = _this.drawOnCanvas.bind(_this);
		_this.isHover = _this.isHover.bind(_this);
		return _this;
	}

	_createClass(GannFan, [{
		key: "isHover",
		value: function isHover(moreProps) {
			var _props = this.props,
			    tolerance = _props.tolerance,
			    onHover = _props.onHover;
			var mouseXY = moreProps.mouseXY;

			var _mouseXY = _slicedToArray(mouseXY, 2),
			    mouseX = _mouseXY[0],
			    mouseY = _mouseXY[1];

			var hovering = false;
			if ((0, _utils.isDefined)(onHover)) {

				var lines = helper(this.props, moreProps);

				for (var i = 0; i < lines.length; i++) {
					var line1 = lines[i];

					var left = Math.min(line1.x1, line1.x2);
					var right = Math.max(line1.x1, line1.x2);
					var top = Math.min(line1.y1, line1.y2);
					var bottom = Math.max(line1.y1, line1.y2);

					var isWithinLineBounds = mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;

					hovering = isWithinLineBounds && (0, _StraightLine.isHovering2)([line1.x1, line1.y1], [line1.x2, line1.y2], mouseXY, tolerance);

					if (hovering) break;
				}
			}
			return hovering;
		}
	}, {
		key: "drawOnCanvas",
		value: function drawOnCanvas(ctx, moreProps) {
			var _props2 = this.props,
			    stroke = _props2.stroke,
			    strokeWidth = _props2.strokeWidth,
			    fillOpacity = _props2.fillOpacity,
			    strokeOpacity = _props2.strokeOpacity,
			    fill = _props2.fill;


			var lines = helper(this.props, moreProps);

			ctx.lineWidth = strokeWidth;
			ctx.strokeStyle = (0, _utils.hexToRGBA)(stroke, strokeOpacity);

			lines.forEach(function (line) {
				var x1 = line.x1,
				    y1 = line.y1,
				    x2 = line.x2,
				    y2 = line.y2;


				ctx.beginPath();
				ctx.moveTo(x1, y1);
				ctx.lineTo(x2, y2);
				ctx.stroke();
			});
			var pairsOfLines = (0, _d3Array.pairs)(lines);

			pairsOfLines.forEach(function (_ref, idx) {
				var _ref2 = _slicedToArray(_ref, 2),
				    line1 = _ref2[0],
				    line2 = _ref2[1];

				ctx.fillStyle = (0, _utils.hexToRGBA)(fill[idx], fillOpacity);

				ctx.beginPath();
				ctx.moveTo(line1.x1, line1.y1);
				ctx.lineTo(line1.x2, line1.y2);
				ctx.lineTo(line2.x2, line2.y2);
				ctx.closePath();
				ctx.fill();
			});
		}
	}, {
		key: "renderSVG",
		value: function renderSVG(moreProps) {
			var _props3 = this.props,
			    stroke = _props3.stroke,
			    strokeWidth = _props3.strokeWidth,
			    fillOpacity = _props3.fillOpacity,
			    fill = _props3.fill,
			    strokeOpacity = _props3.strokeOpacity;


			var lines = helper(this.props, moreProps);
			var pairsOfLines = (0, _d3Array.pairs)(lines);

			return _react2.default.createElement(
				"g",
				null,
				lines.map(function (each, idx) {
					var x1 = each.x1,
					    y1 = each.y1,
					    x2 = each.x2,
					    y2 = each.y2;

					return _react2.default.createElement("line", { key: idx,
						strokeWidth: strokeWidth,
						stroke: stroke,
						strokeOpacity: strokeOpacity,
						x1: x1,
						y1: y1,
						x2: x2,
						y2: y2
					});
				}),
				pairsOfLines.map(function (_ref3, idx) {
					var _ref4 = _slicedToArray(_ref3, 2),
					    line1 = _ref4[0],
					    line2 = _ref4[1];

					var ctx = (0, _d3Path.path)();
					ctx.moveTo(line1.x1, line1.y1);
					ctx.lineTo(line1.x2, line1.y2);
					ctx.lineTo(line2.x2, line2.y2);
					ctx.closePath();
					return _react2.default.createElement("path", { key: idx,
						stroke: "none",
						fill: fill[idx],
						fillOpacity: fillOpacity,
						d: ctx.toString()
					});
				})
			);
		}
	}, {
		key: "render",
		value: function render() {
			var _props4 = this.props,
			    selected = _props4.selected,
			    interactiveCursorClass = _props4.interactiveCursorClass;
			var _props5 = this.props,
			    onDragStart = _props5.onDragStart,
			    onDrag = _props5.onDrag,
			    onDragComplete = _props5.onDragComplete,
			    onHover = _props5.onHover,
			    onUnHover = _props5.onUnHover;


			return _react2.default.createElement(_GenericChartComponent2.default, {
				isHover: this.isHover,

				svgDraw: this.renderSVG,
				canvasToDraw: _GenericComponent.getMouseCanvas,
				canvasDraw: this.drawOnCanvas,

				interactiveCursorClass: interactiveCursorClass,
				selected: selected,

				onDragStart: onDragStart,
				onDrag: onDrag,
				onDragComplete: onDragComplete,
				onHover: onHover,
				onUnHover: onUnHover,

				drawOn: ["mousemove", "mouseleave", "pan", "drag"]
			});
		}
	}]);

	return GannFan;
}(_react.Component);

var xyProvider1 = function xyProvider1(moreProps, endXY, m, b, dx, dy) {
	var yScale = moreProps.chartConfig.yScale;
	// y = mx + b
	// x = (y - b) / m

	var y = yScale(endXY[1]);
	var x = (y - b) / m;
	return [x, y + dy];
};

var xyProvider2 = function xyProvider2(moreProps, endXY, m, b, dx /* , dy*/) {
	var xScale = moreProps.xScale;
	// y = mx + b
	// x = (y - b) / m

	var x = xScale(endXY[0]);
	var y = m * x + b;
	return [x + dx, y];
};

var FAN_LINES_1 = [{ label: "1x8", angle: 82.5, xyProvider: xyProvider1 }, { label: "1x4", angle: 75, xyProvider: xyProvider1 }, { label: "1x3", angle: 71.25, xyProvider: xyProvider1 }, { label: "1x2", angle: 63.75, xyProvider: xyProvider1 }];
var MAIN_LINE = { label: "1x1", angle: 45 };

var FAN_LINES_2 = [{ label: "2x1", angle: 26.25, xyProvider: xyProvider2 }, { label: "3x1", angle: 18.75, xyProvider: xyProvider2 }, { label: "4x1", angle: 15, xyProvider: xyProvider2 }, { label: "8x1", angle: 7.5, xyProvider: xyProvider2 }];

function helper(props, moreProps) {
	var startXY = props.startXY,
	    endXY = props.endXY;
	var xScale = moreProps.xScale,
	    chartConfig = moreProps.chartConfig,
	    plotData = moreProps.plotData;
	var yScale = chartConfig.yScale;
	var xAccessor = moreProps.xAccessor;


	if ((0, _utils.isNotDefined)(startXY) || (0, _utils.isNotDefined)(endXY)) {
		return [];
	}
	if (xAccessor((0, _utils.head)(plotData)) >= Math.max(startXY[0], endXY[0]) || xAccessor((0, _utils.last)(plotData)) <= Math.min(startXY[0], endXY[0])) {
		return [];
	}

	var modLine = (0, _StraightLine.generateLine)({
		type: "RAY",
		start: startXY,
		end: endXY,
		xScale: xScale,
		yScale: yScale
	});

	var x1 = xScale(modLine.x1);
	var y1 = yScale(modLine.y1);
	var x2 = xScale(modLine.x2);
	var y2 = yScale(modLine.y2);

	var m = (0, _StraightLine.getSlope)([x1, y1], [x2, y2]);
	var realSlope = (0, _StraightLine.getSlope)(startXY, endXY);

	var dx = x2 > x1 ? 10 : -10;
	var dy = y2 < y1 ? -10 : 10;

	var line1 = {
		x1: x1, y1: y1, x2: x2, y2: y2,
		text: {
			label: MAIN_LINE.label,
			xy: [xScale(endXY[0]) + dx, yScale(endXY[1]) + dy]
		}
	};

	if ((0, _utils.isNotDefined)(realSlope)) return [];

	var angle = (0, _utils.degrees)(Math.atan(m));

	var mapper = function mapper(each) {
		var reference = correctAngle(angle, angle);
		var theta = correctAngle(angle, each.angle / 45 * reference);

		// console.log(angle, reference, each.angle, theta);

		var slope = Math.tan((0, _utils.radians)(theta));
		var b = (0, _StraightLine.getYIntercept)(slope, [x1, y1]);
		var x2dash = x2 > x1 ? Math.max.apply(Math, _toConsumableArray(xScale.range())) : Math.min.apply(Math, _toConsumableArray(xScale.range()));
		var y2dash = slope * x2dash + b;

		var text = {
			label: each.label,
			xy: each.xyProvider(moreProps, endXY, slope, b, dx, dy)
		};

		return { x1: x1, y1: y1, x2: x2dash, y2: y2dash, text: text };
	};

	var lines = FAN_LINES_1.map(mapper).concat(line1).concat(FAN_LINES_2.map(mapper));

	return lines;
}

function correctAngle(reference, actual) {
	var angle = Math.abs(reference) > 45 ? reference / Math.abs(reference) * 90 - actual : actual;

	return angle;
}

GannFan.propTypes = {
	interactiveCursorClass: _propTypes2.default.string,
	stroke: _propTypes2.default.string.isRequired,
	strokeWidth: _propTypes2.default.number.isRequired,
	fill: _propTypes2.default.arrayOf(_propTypes2.default.string).isRequired,
	strokeOpacity: _propTypes2.default.number.isRequired,
	fillOpacity: _propTypes2.default.number.isRequired,

	fontFamily: _propTypes2.default.string.isRequired,
	fontSize: _propTypes2.default.number.isRequired,
	fontFill: _propTypes2.default.string.isRequired,

	onDragStart: _propTypes2.default.func.isRequired,
	onDrag: _propTypes2.default.func.isRequired,
	onDragComplete: _propTypes2.default.func.isRequired,
	onHover: _propTypes2.default.func,
	onUnHover: _propTypes2.default.func,

	defaultClassName: _propTypes2.default.string,

	tolerance: _propTypes2.default.number.isRequired,
	selected: _propTypes2.default.bool.isRequired
};

GannFan.defaultProps = {
	onDragStart: _utils.noop,
	onDrag: _utils.noop,
	onDragComplete: _utils.noop,

	strokeWidth: 1,
	tolerance: 4,
	selected: false
};

exports.default = GannFan;