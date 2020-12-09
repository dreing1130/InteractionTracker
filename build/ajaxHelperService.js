"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers = {
    okCheck: (response) => {
        return new Promise((resolve, reject) => {
            if (response.status < 400) {
                return resolve(response);
            }
            return reject(response);
        });
    },
    parsePostParameters: (apiUrl, obj) => {
        let url = apiUrl;
        if (!obj) {
            obj = {};
        }
        if (typeof obj === 'string') {
            url = `${url}?${obj}`;
            obj = {};
        }
        return {
            url,
            data: obj,
        };
    },
    setUpRequestByOrigin: (method = 'GET', body, requestMode, contentType, customHeaders) => {
        const headers = customHeaders || new Headers();
        if (contentType) {
            headers.append('Content-Type', contentType);
        }
        return {
            method,
            credentials: 'same-origin',
            mode: requestMode,
            body,
            headers,
        };
    },
    formatParams: (params) => {
        if (!params) {
            return '';
        }
        return ('?' +
            Object.keys(params)
                .map((key) => {
                return key + '=' + encodeURIComponent(params[key]);
            })
                .join('&'));
    }
};
const ajaxHelperService = {
    hideAlert: false,
    post(apiUrl, obj) {
        return new Promise((resolve, reject) => {
            const { url, data } = helpers.parsePostParameters(apiUrl, obj);
            const requestMode = 'cors';
            const request = helpers.setUpRequestByOrigin('POST', JSON.stringify(data), requestMode, 'application/json; charset=utf8');
            fetch(url, request)
                .then(helpers.okCheck)
                .then((response) => {
                const responseContentType = response.headers.get('content-type') || '';
                if (responseContentType.indexOf('application/json') !== -1) {
                    return resolve(response.json());
                }
                return resolve(response.text());
            })
                .catch((response) => {
                const responseContentType = response.headers.get('content-type') || '';
                if (responseContentType.indexOf('application/json') !== -1) {
                    return response.json().then((responseJson) => {
                        return reject((responseJson && responseJson.responseJSON) || responseJson);
                    });
                }
                return reject(response.text());
            });
        });
    },
    get(apiUrl, parameters) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        return resolve(JSON.parse(xhr.response));
                    }
                    catch (error) {
                        return resolve(xhr.response);
                    }
                }
                else {
                    return reject(xhr.response);
                }
            };
            xhr.open('GET', apiUrl + helpers.formatParams(parameters));
            xhr.send();
        });
    },
    ajax(settings) {
        if (!settings || !settings.url) {
            return Promise.reject('No settings provided');
        }
        const type = settings.type && settings.type.toString().toLowerCase();
        if (type === 'get') {
            return ajaxHelperService.get(settings.url, settings.data);
        }
        else if (type === 'post') {
            return ajaxHelperService.post(settings.url, settings.data);
        }
        else if (type === 'delete') {
            return ajaxHelperService.delete(settings.url);
        }
        else {
            return Promise.reject(new Error('unsupported api call'));
        }
    },
    delete(apiUrl) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    return resolve(xhr.response);
                }
                else {
                    return reject(xhr.response);
                }
            };
            xhr.open('DELETE', apiUrl);
            xhr.send();
        });
    }
};
exports.default = ajaxHelperService;
