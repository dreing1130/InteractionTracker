const helpers = {
  okCheck: (response: Response): Promise<Response> => {
    return new Promise((resolve, reject) => {
      if (response.status < 400) {
        return resolve(response);
      }
      return reject(response);
    });
  },
  parsePostParameters: (
    apiUrl: string,
    obj?: any,
  ): { url: string; data: any } => {
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
  formatParams: (params: any) => {
    if (!params) {
      return '';
    }
    return (
      '?' +
      Object.keys(params)
        .map((key) => {
          return key + '=' + encodeURIComponent(params[key]);
        })
        .join('&')
    );
  }
};

const ajaxHelperService = {
  hideAlert: false,
  post(apiUrl: string, obj?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const { url, data } = helpers.parsePostParameters(apiUrl, obj);
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');

      const request: RequestInit = {
        method: 'POST',
        credentials: 'same-origin',
        mode: 'cors',
        body: JSON.stringify(data),
        headers,
      };

      fetch(url, request)
        .then(helpers.okCheck)
        .then((response) => {
          const responseContentType =
            response.headers.get('content-type') || '';
          if (responseContentType.indexOf('application/json') !== -1) {
            return resolve(response.json());
          }
          return resolve(response.text());
        })
        .catch((response) => {
          const responseContentType =
            response.headers.get('content-type') || '';
          if (responseContentType.indexOf('application/json') !== -1) {
            return response.json().then((responseJson: any) => {
              return reject(
                (responseJson && responseJson.responseJSON) || responseJson,
              );
            });
          }
          return reject(response.text());
        });
    });
  },

  get<T>(apiUrl: string, parameters?: object): Promise<T> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            return resolve(JSON.parse(xhr.response));
          } catch (error) {
            return resolve(xhr.response);
          }
        } else {
          return reject(xhr.response);
        }
      };
      xhr.open('GET', apiUrl + helpers.formatParams(parameters));
      xhr.send();
    });
  },

  ajax<T>(settings: any): Promise<T> {
    if (!settings || !settings.url) {
      return Promise.reject('No settings provided');
    }
    const type = settings.type && settings.type.toString().toLowerCase();
    if (type === 'get') {
      return ajaxHelperService.get<T>(settings.url, settings.data);
    } else if (type === 'post') {
      return ajaxHelperService.post(settings.url, settings.data);
    } else if (type === 'delete') {
      return ajaxHelperService.delete(settings.url);
    } else {
      return Promise.reject(new Error('unsupported api call'));
    }
  },

  delete(apiUrl: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          return resolve(xhr.response);
        } else {
          return reject(xhr.response);
        }
      };
      xhr.open('DELETE', apiUrl);
      xhr.send();
    });
  }
};

export default ajaxHelperService;
