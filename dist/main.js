'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.init = undefined;

var _child_process = require('child_process');

var _shelljs = require('shelljs');

var _messageTypes = require('./parser/messageTypes.js');

var MessageTypes = _interopRequireWildcard(_messageTypes);

var _parser = require('./parser/parser.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var postConnectScript = "/home/pi/scripts/audio/a2dp-autoconnect";

var ApplicationState = {
    deviceConnected: false,
    trustedDevices: []
};

var initializeStatusMonitoring = function initializeStatusMonitoring() {
    var child = (0, _child_process.spawn)('bluetoothctl');
    child.stdout.on('data', function (data) {
        var inputs = data.toString().split("\n");
        for (var i = 0; i < inputs.length; i++) {
            (0, _parser.input)(inputs[i], dataCallback);
        }
    });
    child.stderr.on('data', function (data) {
        (0, _parser.error)(data, errorCallback);
    });
    child.stdin.setEncoding('utf-8');
    ApplicationState.bluetoothctlInputStream = child.stdin;
};

var initializeRunLoop = function initializeRunLoop() {
    setTimeout(runLoop, 1000);
};

var runLoop = function runLoop() {
    if (!ApplicationState.deviceConnected) {
        var lastDeviceTried = ApplicationState.lastDeviceTried;
        if (!lastDeviceTried && ApplicationState.trustedDevices.length > 0) {
            lastDeviceTried = ApplicationState.trustedDevices[0];
            ApplicationState.lastDeviceTried = lastDeviceTried;
            ApplicationState.bluetoothctlInputStream.write('connect ' + lastDeviceTried + '\n');
        }
    }
    setTimeout(runLoop, 1000);
};

var dataCallback = function dataCallback(deviceEvent) {
    switch (deviceEvent.messageType) {
        case MessageTypes.NEW:
            if (deviceEvent.messageSubType === "Device") {
                ApplicationState.trustedDevices.push(deviceEvent.macAddress);
            }
            break;
        case MessageTypes.CHANGE:
            if (deviceEvent.messageSubType === "Device") {
                if (deviceEvent.Connected) {
                    ApplicationState.deviceConnected = deviceEvent.macAddress;
                    _shelljs.shell.exec(postConnectScript);
                } else {
                    ApplicationState.deviceConnected = false;
                }
            }
    }
};

var errorCallback = function errorCallback(error) {};

var init = exports.init = function init() {

    initializeStatusMonitoring();

    initializeRunLoop();
};

init();