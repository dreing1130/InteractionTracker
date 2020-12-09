"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./api"));
let configuration = {
    customerId: null,
    domain: '',
    apiBaseUrl: '',
    events: [],
};
const validateConfiguration = (_configuration) => {
    if (!!configuration.apiBaseUrl) {
        console.error('An API base url must be set');
        return false;
    }
    if (!!configuration.domain) {
        console.error('A site domain must be provided');
        return false;
    }
    return true;
};
const initialize = (_configuration) => {
    if (!validateConfiguration) {
        return;
    }
    configuration = _configuration;
    bindEvents();
};
exports.initialize = initialize;
const bindEvents = () => {
    configuration.events.forEach((event) => {
        const elements = [...document.querySelectorAll(`[${event.hookName}]`)];
        elements.forEach((el) => {
            el.addEventListener(event.type, eventHandler(el, event));
        });
    });
};
const eventHandler = (el, event) => {
    return (_e) => {
        const itemId = el.getAttribute(reservedAttributes.itemId);
        const eventName = el.getAttribute(event.hookName);
        const payload = {
            itemId,
            customerId: configuration.customerId,
            eventName,
        };
        api_1.default.recordEvent(payload, configuration.apiBaseUrl);
    };
};
const reservedAttributes = {
    itemId: 'personalize-itemId',
};
