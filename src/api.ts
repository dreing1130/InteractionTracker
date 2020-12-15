import { API, RecordInteractionPayload } from '../@types';
import ajaxHelperService from './ajaxHelperService';

const api: API = {
  recordInteraction: (payload: RecordInteractionPayload, baseUrl: string) => {
    console.log(payload);
    const apiUrl = `${baseUrl.trim().replace(/\/$/, '')}/recordInteraction`;
    return ajaxHelperService.post(apiUrl, payload);
  }
}

export {
  api
};
