"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _messageTypes = require("../parser/messageTypes.js");

var MessageTypes = _interopRequireWildcard(_messageTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var convertYesNoToBoolean = function convertYesNoToBoolean(string) {
    return string === "yes" ? true : string === "no" ? false : string;
};

var DeviceEvent = function DeviceEvent(messageType, messageSubType, macAddress, eventString) {
    _classCallCheck(this, DeviceEvent);

    this.messageType = messageType;
    this.messageSubType = messageSubType;
    this.macAddress = macAddress;

    for (var _len = arguments.length, data = Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++) {
        data[_key - 4] = arguments[_key];
    }

    this.data = data.join(' ');

    if (messageType === MessageTypes.CHANGE) {
        var eventData = eventString.split(':');
        var eventName = eventData[0];
        var eventValue = convertYesNoToBoolean(eventData[1].trim());
        this[eventName] = eventValue;
    }
};

exports.default = DeviceEvent;