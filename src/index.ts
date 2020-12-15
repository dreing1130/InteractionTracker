import { Configuration, InteractionHook, RecordInteractionPayload } from '../@types';
import {api} from './api'

let configuration: Configuration = {
  apiBaseUrl: '',
  customerId: null,
  interactions: [],
  sessionId: '',
};

const validateConfiguration = (_configuration: Configuration) => {
  if(!!configuration.apiBaseUrl) {
    console.error('An API base url must be set')
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
  const eventTypes = configuration.interactions
    .map((e) => e.eventType)
    .filter((v, i, a) => a.indexOf(v) === i);
    eventTypes.forEach((eventType) => {
    bindEvent(eventType);
  });
}

const bindEvent = (eventType: string) => {
  document.addEventListener(eventType, (event) => {
    const releventInteractions = configuration.interactions.filter((trackedInteraction) => trackedInteraction.eventType === eventType);
    releventInteractions.forEach((trackedInteraction) => {
      const element = (event.target as HTMLElement);
      if(element.matches(trackedInteraction.hookSelector)){
        recordInteraction(element, trackedInteraction);
      }
    });
  }, {passive: true, });
}

const recordInteraction = (el: HTMLElement, interaction: InteractionHook) => {
  const itemId = interaction.itemIdGetter(el);
  if(!itemId){
    throw new Error('Interaction tracker unable to find item id');
  }
  const payload: RecordInteractionPayload = {
    itemId,
    customerId: configuration.customerId,
    interactionName: interaction.interactionName,
    sessionId: configuration.sessionId,
  };
  api.recordInteraction(payload, configuration.apiBaseUrl);
}

export default {
  initialize
};
