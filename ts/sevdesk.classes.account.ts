import * as plugins from './sevdesk.plugins';

export class SevdeskAccount {
  /**
   * the api key used to authenticate
   */
  authToken: string;

  apiDomain = 'https://my.sevdesk.de/api/v1';

  constructor(authTokenArg: string) {
    this.authToken = authTokenArg;
  }

  async request(methodArg: 'POST' | 'GET', routeArg: string, payloadArg?: any) {
    const sevdeskHeaders = {
      Authorization: this.authToken,
      accept: 'application/json'
    }
    if(payloadArg) {
      sevdeskHeaders['Content-Type'] = 'application/json'
    }

    const response = await plugins.smartrequest.request(`${this.apiDomain}${routeArg}`, {
      method: methodArg,
      headers: sevdeskHeaders,
      requestBody: payloadArg
    });
    if(response.statusCode !== 200) {
      // console.log(response.body);
    }
    return response.body;
  }
}
