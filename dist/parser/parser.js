'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.error = exports.input = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _messageTypes = require('./messageTypes.js');

var MessageTypes = _interopRequireWildcard(_messageTypes);

var _deviceEvent = require('../models/deviceEvent.js');

var _deviceEvent2 = _interopRequireDefault(_deviceEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var input = exports.input = function input(data, dataCallback) {
    console.log("attempting to parse data");
    console.log(typeof data === 'undefined' ? 'undefined' : _typeof(data), data.toString());
    if (!data || !data.toString) {
        dataCallback({});
    }
    console.log("parsing data:" + data);
    data = data.toString().split(' ');

    if (data.length > 1) {
        switch (data[0]) {
            case MessageTypes.NEW:
                dataCallback(new (Function.prototype.bind.apply(_deviceEvent2.default, [null].concat([MessageTypes.NEW, data[1], data[2], false], _toConsumableArray(data.slice(3)))))());
                break;
            case MessageTypes.CHG:
                console.log("Parsing change event");
                dataCallback(new (Function.prototype.bind.apply(_deviceEvent2.default, [null].concat([MessageTypes.CHANGE, data[1], data[2], data[3]], _toConsumableArray(data.slice(4)))))());
                break;
            default:
                console.log("Failed to parse event", data.toString());
                break;
        }
    } else {
        dataCallback({
            type: "System message",
            message: data.join(' ')
        });
    }
};

var error = exports.error = function error(data) {
    return data;
};