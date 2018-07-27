import *  as MessageTypes from './messageTypes.js';
import DeviceEvent from '../models/deviceEvent.js';

export const input = (data, dataCallback) => {
    if (!data || !data.toString) {
        dataCallback({});
    }
    console.log("attempting to parse data"+data.toString());
    data = data.toString().split(' ');
    if (data.length > 1) {
        switch(data[0]) {
            case MessageTypes.NEW:
                dataCallback(new DeviceEvent(MessageTypes.NEW, data[1], data[2], false, ...data.slice(3)));
            break;
            case MessageTypes.CHG:
                dataCallback(new DeviceEvent(MessageTypes.CHANGE, data[1], data[2], data[3], ...data.slice(4)));
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