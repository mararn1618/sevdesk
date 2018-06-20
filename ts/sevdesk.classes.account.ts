import * as plugins from './sevdesk.plugins';

export class SevdeskAccount {
  /**
   * the api key used to authenticate
   */
  authToken: string;

  apiDomain = 'https://my.sevdesk.de/api/v1'

  constructor(authTokenArg: string) {
    this.authToken = authTokenArg;
  }

  async request(methodArg: 'POST' | 'GET', routeArg: string, payloadArg: any) {
    const response = await plugins.smartrequest.request(`${this.apiDomain}${routeArg}`, {
      method: methodArg,
      headers: {
        "Authorization": this.authToken,
        "Content-Type": "application/json",
        "accept": "application/json"
      },
      requestBody: payloadArg
    })
    console.log(response.body);
  }
}
