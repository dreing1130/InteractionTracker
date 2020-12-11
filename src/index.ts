import { exception } from 'console';
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
  const eventNames = configuration.events
    .map((e) => e.eventName)
    .filter((v, i, a) => a.indexOf(v) === i);
  eventNames.forEach((eventName) => {
    bindEvent(eventName);
  });
}

const bindEvent = (eventName: string) => {
  document.addEventListener(eventName, (firedEvent) => {
    const releventEvents = configuration.events.filter((trackedEvent) => trackedEvent.eventName === eventName);
    releventEvents.forEach((trackedEvent) => {
      const element = (firedEvent.target as HTMLElement);
      if(element.matches(trackedEvent.hookSelector)){
        eventHandler(element, trackedEvent);
      }
    });
  }, {passive: true, });
}

const eventHandler = (el: HTMLElement, event: EventHook) => {
  return (_e: Event) => {
    const itemId = event.itemIdGetter(el);
    if(!itemId){
      throw exception('Interaction tracker unable to find item id', event, el);
    }
    const payload: RecordEventPayload = {
      itemId,
      customerId: configuration.customerId,
      eventName: event.eventName,
    };
    api.recordEvent(payload, configuration.apiBaseUrl);
  };
}

export default {
  initialize
};
