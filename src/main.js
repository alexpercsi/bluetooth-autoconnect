import { spawn } from 'child_process'; 
import { shell } from 'shelljs';

import * as MessageTypes from './parser/messageTypes.js';
import { input, error } from './parser/parser.js';

const postConnectScript = "/home/pi/scripts/audio/a2dp-autoconnect";

const ApplicationState = {
    deviceConnected: false,
    trustedDevices: []
}


const initializeStatusMonitoring = () => {
    var child = spawn('bluetoothctl');
    child.stdout.on('data', (data) => {
        let inputs = data.toString().split("\n");
        for (let i = 0; i < inputs.length; i++) {
            input(inputs[i], dataCallback);
        }
    });
    child.stderr.on('data', (data) => { error(data, errorCallback)} );
    child.stdin.setEncoding('utf-8');
    ApplicationState.bluetoothctlInputStream = child.stdin;
}

const initializeRunLoop = () => {
    setTimeout(runLoop, 1000);
}

const runLoop = () => {
    if (!ApplicationState.deviceConnected) {
        let lastDeviceTried = ApplicationState.lastDeviceTried;
        if (!lastDeviceTried && ApplicationState.trustedDevices.length > 0) {
            lastDeviceTried = ApplicationState.trustedDevices[0];
            ApplicationState.lastDeviceTried = lastDeviceTried;
            ApplicationState.bluetoothctlInputStream.write(`connect ${lastDeviceTried}\n`);
        }
    }
    setTimeout (runLoop, 1000);
}

const dataCallback = (deviceEvent) => {
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
                shell.exec(postConnectScript);
            }
            else {
                ApplicationState.deviceConnected = false;
            }
        }
    }
}

const errorCallback = (error) => {
    
}

export const init = () => {

    initializeStatusMonitoring();
    
    initializeRunLoop();

}

init();