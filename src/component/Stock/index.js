// common components

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ChartCanvas = require("./Lib/ChartCanvas");

Object.defineProperty(exports, "ChartCanvas", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ChartCanvas).default;
  }
});

var _Chart = require("./Lib/Chart");

Object.defineProperty(exports, "Chart", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Chart).default;
  }
});

var _GenericChartComponent = require("./Lib/GenericChartComponent");

Object.defineProperty(exports, "GenericChartComponent", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GenericChartComponent).default;
  }
});

var _GenericComponent = require("./Lib/GenericComponent");

Object.defineProperty(exports, "GenericComponent", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GenericComponent).default;
  }
});

var _BackgroundText = require("./Lib/BackgroundText");

Object.defineProperty(exports, "BackgroundText", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_BackgroundText).default;
  }
});

var _ZoomButtons = require("./Lib/ZoomButtons");

Object.defineProperty(exports, "ZoomButtons", {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_ZoomButtons).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var version = exports.version = "0.7.0-beta.17";

/*
// chart types & Series
import * as series from "./Lib/series";
import * as scale from "./Lib/scale";

import * as coordinates from "./Lib/coordinates";
import * as indicator from "./Lib/indicator";
import * as algorithm from "./Lib/algorithm";

import * as annotation from "./Lib/annotation";

import * as axes from "./Lib/axes";
import * as tooltip from "./Lib/tooltip";
import * as helper from "./Lib/helper";

import * as interactive from "./Lib/interactive";
import * as utils from "./Lib/utils";

*/