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

  async request(
    methodArg: "POST" | "GET",
    routeArg: string,
    payloadArg: any = null,
    payloadType: "json" | "file" = "json"
  ) {
    let sevdeskHeaders = {
      Authorization: this.authToken,
      accept: "application/json",
      "Cache-Control": "no-cache"
    };

    if (payloadArg && payloadType === "json") {
      sevdeskHeaders["Content-Type"] = "application/json";
    }

    if (payloadArg && payloadType === "file") {
      const formDataInstance = new plugins.formData();
      formDataInstance.append("file", payloadArg);
      payloadArg = formDataInstance;
      formDataInstance.getHeaders();
      sevdeskHeaders = Object.assign(
        {},
        sevdeskHeaders,
        formDataInstance.getHeaders()
      );

      var http = require("http");

      var request = http.request({
        method: "post",
        host: `${this.apiDomain}`,
        path: `${routeArg}`,
        headers: sevdeskHeaders
      });

      formDataInstance.pipe(request);
      request.on('response', function(res) {
        console.log(res.statusCode);
      });
      return
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
      console.log(response.body);
    }
    return response.body;
  }
}
