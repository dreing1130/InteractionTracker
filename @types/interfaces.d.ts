declare interface Configuration {
  apiBaseUrl: string,
  customerId: string|null,
  interactions: InteractionHook[],
  sessionId: string,
}

declare interface InteractionHook {
  eventType: 'click'|'mouseenter',
  hookSelector: string,
  interactionName: string,
  itemIdGetter: (triggerElement: HTMLElement) => string,
}

declare interface RecordInteractionPayload {
  customerId: string | null,
  itemId: string,
  interactionName: string,
  sessionId: string,
}

declare interface API {
  recordInteraction: (payload: RecordInteractionPayload, baseUrl: string) => Promise<void>,
}

export {
  Configuration,
  InteractionHook,
  RecordInteractionPayload,
  API
}
