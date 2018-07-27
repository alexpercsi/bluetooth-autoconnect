import * as MessageTypes from '../parser/messageTypes.js';

const convertYesNoToBoolean = (string) => string==="yes"?true:(string==="no"?false:string);

export default class DeviceEvent {
    constructor(messageType, messageSubType, macAddress, eventString, ...data) {
        this.messageType = messageType;
        this.messageSubType = messageSubType
        this.macAddress = macAddress;
        this.data = data.join(' ');

        if (messageType === MessageTypes.CHANGE) {
            let eventData = eventString.split(':');
            let eventName = eventData[0];
            let eventValue = convertYesNoToBoolean(eventData[1].trim());
            this[eventName] = eventValue;
        }

        console.log (arguments.join(' '));
    }
}