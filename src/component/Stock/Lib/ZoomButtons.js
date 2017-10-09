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

var _d3Interpolate = require("d3-interpolate");

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import { mean } from "d3-array";

var ZoomButtons = function (_Component) {
	_inherits(ZoomButtons, _Component);

	function ZoomButtons(props) {
		_classCallCheck(this, ZoomButtons);

		var _this = _possibleConstructorReturn(this, (ZoomButtons.__proto__ || Object.getPrototypeOf(ZoomButtons)).call(this, props));

		_this.handleZoomOut = _this.handleZoomOut.bind(_this);
		_this.handleZoomIn = _this.handleZoomIn.bind(_this);
		_this.zoom = _this.zoom.bind(_this);
		return _this;
	}

	_createClass(ZoomButtons, [{
		key: "zoom",
		value: function zoom(direction) {
			var _this2 = this;

			var _context = this.context,
			    xAxisZoom = _context.xAxisZoom,
			    xScale = _context.xScale,
			    plotData = _context.plotData,
			    xAccessor = _context.xAccessor;

			var cx = xScale(xAccessor((0, _utils.last)(plotData)));
			// mean(xScale.range());
			var zoomMultiplier = this.props.zoomMultiplier;


			var c = direction > 0 ? 1 * zoomMultiplier : 1 / zoomMultiplier;

			var _xScale$domain = xScale.domain(),
			    _xScale$domain2 = _slicedToArray(_xScale$domain, 2),
			    start = _xScale$domain2[0],
			    end = _xScale$domain2[1];

			var _xScale$range$map$map = xScale.range().map(function (x) {
				return cx + (x - cx) * c;
			}).map(xScale.invert),
			    _xScale$range$map$map2 = _slicedToArray(_xScale$range$map$map, 2),
			    newStart = _xScale$range$map$map2[0],
			    newEnd = _xScale$range$map$map2[1];

			var left = (0, _d3Interpolate.interpolateNumber)(start, newStart);
			var right = (0, _d3Interpolate.interpolateNumber)(end, newEnd);

			var foo = [0.25, 0.3, 0.5, 0.6, 0.75, 1].map(function (i) {
				return [left(i), right(i)];
			});

			this.interval = setInterval(function () {
				xAxisZoom(foo.shift());
				if (foo.length === 0) {
					clearInterval(_this2.interval);
				}
			}, 10);
		}
	}, {
		key: "handleZoomOut",
		value: function handleZoomOut() {
			this.zoom(1);
		}
	}, {
		key: "handleZoomIn",
		value: function handleZoomIn() {
			this.zoom(-1);
		}
	}, {
		key: "render",
		value: function render() {
			var chartConfig = this.context.chartConfig;
			var width = chartConfig.width,
			    height = chartConfig.height;
			var _props = this.props,
			    size = _props.size,
			    heightFromBase = _props.heightFromBase,
			    rx = _props.rx,
			    ry = _props.ry;
			var _props2 = this.props,
			    stroke = _props2.stroke,
			    fill = _props2.fill,
			    strokeWidth = _props2.strokeWidth,
			    fillOpacity = _props2.fillOpacity;
			var _props3 = this.props,
			    fontSize = _props3.fontSize,
			    textDy = _props3.textDy,
			    textFill = _props3.textFill;

			var centerX = width / 2;
			var y = height - heightFromBase;

			return _react2.default.createElement(
				"g",
				{ className: "react-stockcharts-zoom-button" },
				_react2.default.createElement("rect", {
					x: centerX - size - 1,
					y: y,
					rx: rx,
					ry: ry,
					height: size,
					width: size,
					fill: fill,
					fillOpacity: fillOpacity,
					stroke: stroke,
					strokeWidth: strokeWidth
				}),
				_react2.default.createElement(
					"text",
					{
						x: centerX - size / 2 - 1,
						y: y + size / 2,
						dy: textDy,
						textAnchor: "middle",
						fontSize: fontSize,
						fill: textFill
					},
					"-"
				),
				_react2.default.createElement("rect", {
					x: centerX + 1,
					y: y,
					rx: rx,
					ry: ry,
					height: size,
					width: size,
					fill: fill,
					fillOpacity: fillOpacity,
					stroke: stroke,
					strokeWidth: strokeWidth
				}),
				_react2.default.createElement(
					"text",
					{
						x: centerX + size / 2 + 1,
						y: y + size / 2,
						dy: textDy,
						textAnchor: "middle",
						fontSize: fontSize,
						fill: textFill
					},
					"+"
				),
				_react2.default.createElement("rect", { className: "react-stockcharts-enable-interaction",
					onClick: this.handleZoomOut,
					x: centerX - size - 1,
					y: y,
					rx: rx,
					ry: ry,
					height: size,
					width: size,
					fill: "none"
				}),
				_react2.default.createElement("rect", { className: "react-stockcharts-enable-interaction",
					onClick: this.handleZoomIn,
					x: centerX + 1,
					y: y,
					rx: rx,
					ry: ry,
					height: size,
					width: size,
					fill: "none"
				})
			);
		}
	}]);

	return ZoomButtons;
}(_react.Component);

ZoomButtons.propTypes = {
	zoomMultiplier: _propTypes2.default.number.isRequired,
	size: _propTypes2.default.number.isRequired,
	heightFromBase: _propTypes2.default.number.isRequired,
	rx: _propTypes2.default.number.isRequired,
	ry: _propTypes2.default.number.isRequired,
	stroke: _propTypes2.default.string.isRequired,
	strokeWidth: _propTypes2.default.number.isRequired,
	fill: _propTypes2.default.string.isRequired,
	fillOpacity: _propTypes2.default.number.isRequired,
	fontSize: _propTypes2.default.number.isRequired,
	textDy: _propTypes2.default.string.isRequired,
	textFill: _propTypes2.default.string.isRequired
};

ZoomButtons.defaultProps = {
	size: 20,
	heightFromBase: 50,
	rx: 3,
	ry: 3,
	stroke: "#000000",
	strokeWidth: 1,
	fill: "#D6D6D6",
	fillOpacity: 1,
	fontSize: 16,
	textDy: ".3em",
	textFill: "#000000",
	zoomMultiplier: 1.5
};

ZoomButtons.contextTypes = {
	xScale: _propTypes2.default.func.isRequired,
	chartConfig: _propTypes2.default.object.isRequired,
	plotData: _propTypes2.default.array.isRequired,
	xAccessor: _propTypes2.default.func.isRequired,
	xAxisZoom: _propTypes2.default.func.isRequired
};

exports.default = ZoomButtons;