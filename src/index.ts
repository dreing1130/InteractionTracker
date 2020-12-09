import { Configuration, EventHook, RecordEventPayload } from '../@types';
import {api} from './api'

let configuration: Configuration = {
  customerId: null,
  domain: '',
  apiBaseUrl: '',
  events: [],
};

const validateConfiguration = (_configuration: Configuration) => {
  if(!!configuration.apiBaseUrl) {
    console.error('An API base url must be set')
    return false;
  }
  if(!!configuration.domain) {
    console.error('A site domain must be provided')
    return false;
  }
  return true;
}

const initialize = (_configuration: Configuration) => {
  if(!validateConfiguration){
    return;
  }
  configuration = _configuration;

  bindEvents();
};

const bindEvents = () => {
  configuration.events.forEach((event) => {
    const elements = [...document.querySelectorAll(`[${event.hookName}]`)] as HTMLElement[];
    elements.forEach((el) => {
      el.addEventListener(event.type, eventHandler(el, event))
    });
  });
}

const eventHandler = (el: HTMLElement, event: EventHook) => {
  return (_e: Event) => {
    const itemId = el.getAttribute(reservedAttributes.itemId) as string;
    const payload: RecordEventPayload = {
      itemId,
      customerId: configuration.customerId,
      eventName: event.eventName,
    };
    api.recordEvent(payload, configuration.apiBaseUrl);
  };
}

const reservedAttributes = {
  itemId: 'personalize-itemId',
}

export default {
  initialize
};
