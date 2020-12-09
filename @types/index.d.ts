interface Configuration {
  customerId: string|null,
  domain: string,
  apiBaseUrl: string,
  events: EventHook[],
}
interface EventHook {
  hookName: string,
  type: 'click'|'hover',
  eventName: string,
}
interface RecordEventPayload {
  itemId: string,
  customerId: string | null,
  eventName: string,
}
interface API {
  recordEvent: (payload: RecordEventPayload, baseUrl: string) => Promise<void>,
}
