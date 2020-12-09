const api: API = {
  recordEvent: (payload: RecordEventPayload, _baseUrl: string) => {
    console.log(payload);
    // const url = baseUrl + '/recordEvent';
    return Promise.resolve();
  }
}

export default api;
