import { API, RecordEventPayload } from '../@types';
import ajaxHelperService from './ajaxHelperService';

const api: API = {
  recordEvent: (payload: RecordEventPayload, baseUrl: string) => {
    console.log(payload);
    const apiUrl = `${baseUrl.trim().replace(/\/$/, '')}/recordEvent`;
    return ajaxHelperService.post(apiUrl, payload);
  }
}

export {
  api
};
