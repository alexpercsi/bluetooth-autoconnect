import stripAnsi from 'strip-ansi';

import *  as MessageTypes from './messageTypes.js';
import DeviceEvent from '../models/deviceEvent.js';

export const input = (data, dataCallback) => {
    if (!data || !data.split) {
        dataCallback({});
    }
    data = stripAnsi(data.toString()).split(' ').slice(1);
    if (data.length > 1) {
        switch(data[0].trim()) {
            case MessageTypes.NEW:
                dataCallback(new DeviceEvent(MessageTypes.NEW, data[1], data[2], false, ...data.slice(3)));
            break;
            case MessageTypes.CHG:
                dataCallback(new DeviceEvent(MessageTypes.CHANGE, data[1], data[2], data[3], ...data.slice(4)));
            break;
            default:
                break;
        }
    }
    else {
        dataCallback({
            type: "System message",
            message: data.join(' ')
        });
    }
 
}

export const error = (data) => {
    return data;
}