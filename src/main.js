import { exec } from 'child_process'; 

import { Monitor } from 'monitor/monitor.js';
import { input, error } from 'parser/parser.js';

const init = () => {

    

}

const initializeStatusMonitoring = () => {
    
    var child = exec('bluetoothctl');
    child.stdout.on('data', input.parseData(data, dataCallback));
    child.stderr.on('data', input.handleError(data, errorCallback));
}

const dataCallback = (input) => {

}

const errorCallback = (input) => {
    
}