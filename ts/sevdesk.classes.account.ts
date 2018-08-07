import * as plugins from "./sevdesk.plugins";

export class SevdeskAccount {
  /**
   * the api key used to authenticate
   */
  authToken: string;

  apiDomain = "https://my.sevdesk.de/api/v1";

  constructor(authTokenArg: string) {
    this.authToken = authTokenArg;
  }

  getCheckingAccounts() {
    
  }

  async request(
    methodArg: "POST" | "GET",
    routeArg: string,
    payloadArg: any = null,
    payloadType: "json" | "pdf" = "json"
  ) {
    if (payloadArg && payloadType === "pdf") {
      const response = await plugins.smartrequest.postFormData(`${this.apiDomain}${routeArg}`, {
        method: 'POST',
        headers: {
          Authorization: this.authToken
        }
      }, [
        {
          name: 'file.pdf',
          type: 'filePath',
          payload: 'test/testvoucher.pdf'
        }
      ])
      return response.body
    } else {
      let sevdeskHeaders = {
        authorization: this.authToken,
        accept: "application/json",
        "cache-control": "no-cache"
      };
      if (payloadArg && payloadType === "json") {
        sevdeskHeaders["Content-Type"] = "application/json";
      }
      const response = await plugins.smartrequest.request(
        `${this.apiDomain}${routeArg}`,
        {
          method: methodArg,
          headers: sevdeskHeaders,
          requestBody: payloadArg
        }
      );
      if (response.statusCode !== 200) {
        console.log(`Logging response body with status ${response.statusCode}:`)
        console.log(response.body);
      }
      return response.body;
    }

  }
}
