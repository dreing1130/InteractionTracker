declare interface Configuration {
  customerId: string|null,
  domain: string,
  apiBaseUrl: string,
  events: EventHook[],
}
declare interface EventHook {
  hookSelector: string,
  type: 'click'|'mouseenter',
  eventName: string,
  itemIdGetter: (triggerElement: HTMLElement) => string
}
declare interface RecordEventPayload {
  itemId: string,
  customerId: string | null,
  eventName: string,
}
declare interface API {
  recordEvent: (payload: RecordEventPayload, baseUrl: string) => Promise<void>,
}

export {
  Configuration,
  EventHook,
  RecordEventPayload,
  API
}
