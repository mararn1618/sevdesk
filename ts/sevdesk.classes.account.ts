import * as plugins from './sevdesk.plugins';
import { SevdeskCheckingAccount } from './sevdesk.classes.checkingaccount';
import { SevdeskContact } from './sevdesk.classes.contact';
import { ICheckingAccount } from '@tsclass/tsclass/dist_ts/finance';
import { SevdeskVoucher, ISevdeskVoucherOptions } from './sevdesk.classes.voucher';

export class SevdeskAccount {
  /**
   * the api key used to authenticate
   */
  authToken: string;

  apiDomain = 'https://my.sevdesk.de/api/v1';

  constructor(authTokenArg: string) {
    this.authToken = authTokenArg;
  }

  async getCheckingAccounts() {
    return await SevdeskCheckingAccount.getAllCheckingAccounts(this);
  }

  public async createCheckingAccount(optionsArg: ICheckingAccount) {
    return await SevdeskCheckingAccount.createCheckingAccount(this, optionsArg);
  }

  public async getContacts() {
    return await SevdeskContact.getAllContacts(this);
  }

  public async createVoucher(optionsArg: ISevdeskVoucherOptions) {
    return await SevdeskVoucher.createVoucher(this, optionsArg);
  } 

  async request(
    methodArg: 'POST' | 'GET',
    routeArg: string,
    payloadArg: any = null,
    payloadType: 'json' | 'pdf' = 'json'
  ) {
    if (payloadArg && payloadType === 'pdf') {
      const response = await plugins.smartrequest.postFormData(
        `${this.apiDomain}${routeArg}`,
        {
          method: 'POST',
          headers: {
            Authorization: this.authToken,
          },
          keepAlive: false
        },
        [
          {
            name: 'file.pdf',
            type: 'filePath',
            payload: payloadArg,
          },
        ]
      );
      return response.body;
    } else {
      let sevdeskHeaders = {
        authorization: this.authToken,
        accept: 'application/json',
        'cache-control': 'no-cache',
      };
      if (payloadArg && payloadType === 'json') {
        sevdeskHeaders['Content-Type'] = 'application/json';
      }
      const response = await plugins.smartrequest.request(`${this.apiDomain}${routeArg}`, {
        method: methodArg,
        headers: sevdeskHeaders,
        requestBody: payloadArg,
        keepAlive: false
      });
      if (response.statusCode !== 200) {
        console.log(`Logging response body with status ${response.statusCode}:`);
        console.log(response.body);
      }
      return response.body;
    }
  }
}
