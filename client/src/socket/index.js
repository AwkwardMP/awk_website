import { EventEmitter } from "events";

class AWKMPSocket extends EventEmitter {
    constructor(url, options) { 
        super();
        this.instance = null;
        this.url = url;

        this.options = options || this.defaultOptions();
        if(this.options) {
            this.reconnectEnabled = options.reconnectEnabled || false;
            if (this.reconnectEnabled) {
                this.reconnectInterval = options.reconnectInterval
            }
        }
    }

    defaultOptions() {
        return {
            reconnectEnabled: false,
            reconnectInterval: 0
        }
    }

    connect() {
        this.instance = new WebSocket(this.url);

        // Socket event listeners
        // Each event handler also calls the corresponding class method, which can be defined by the component
        this.instance.onopen = () => {
            
            this.emit("onOpen");
            
        };

        this.instance.onmessage = (msg) => {
            const {_type, _params} = JSON.parse(msg.data);
            if(!_type || !_params) return;

            this.emit("onMessage", {_type, _params});
        };

        this.instance.onclose = (evt) => {
            this.emit("onClose", evt);
    

            if (!evt.wasClean && this.reconnectEnabled) {
                this.reconnect();
            }
        };

        this.instance.onerror = (evt) => {
            this.emit("onError", evt);
        }
    }

    reconnect() {
        delete this.instance;
        setTimeout(() => {
            this.connect();
        });
    }

    send(_type, _params = {}) {
        this.instance.send(JSON.stringify({"_type": _type, "_params": _params}));
    }
}

import {inject} from 'vue';

export default {
    install: (app, connection, options) => {
        const socket = new AWKMPSocket(connection, options)
        socket.connect();
        app.config.globalProperties.$socket = socket;
        app.provide("AWKMPSocket", socket);
    }
}


export const  useSocket = () => {
    return inject("AWKMPSocket");
}