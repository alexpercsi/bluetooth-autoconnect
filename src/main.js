import { spawn } from 'child_process'; 

import * as MessageTypes from './parser/messageTypes.js';
import { input, error } from './parser/parser.js';


const ApplicationState = {
    deviceConnected: false,
    trustedDevices: []
}


const initializeStatusMonitoring = () => {
    console.log("spawning child process");
    var child = spawn('bluetoothctl');
    child.stdout.on('data', (data) => { input(data, dataCallback)} );
    child.stderr.on('data', (data) => { error(data, errorCallback)} );
    child.stdin.setEncoding('utf-8');
    ApplicationState.bluetoothctlInputStream = child.stdin;
}

const initializeRunLoop = () => {
    setTimeout(runLoop, 1000);
}

const runLoop = () => {
    console.log("RunLoop"+Date.now)
    if (!ApplicationState.deviceConnected) {
        console.log("No device connected");
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
            trustedDevices.push(deviceEvent.macAddress);
        }
        break;
        case MessageTypes.CHANGE:
        if (deviceEvent.messageSubType === "Device") {
            if (deviceEvent.Connected) {
                ApplicationState.deviceConnected = deviceEvent.macAddress;
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