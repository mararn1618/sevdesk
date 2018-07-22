import { SevdeskAccount } from "./sevdesk.classes.account";

import { ICheckingAccount, TCurrency, ITransaction } from '@tsclass/tsclass';

export class SevdeskCheckingAccount implements ICheckingAccount {
  static async getCheckingAccountByName(
    sevdeskAccount: SevdeskAccount,
    checkAccontNameArg: string
  ): Promise<SevdeskCheckingAccount> {
    let resultingCheckAccount: SevdeskCheckingAccount;
    const response = await sevdeskAccount.request('GET', '/CheckAccount')
    const existingCheckAccountApiObject = response.objects.find(checkAccountApiObject => {
      return checkAccountApiObject.name === checkAccontNameArg
    })
    if(existingCheckAccountApiObject) {
      resultingCheckAccount = new SevdeskCheckingAccount({
        name: existingCheckAccountApiObject.name,
        currency: existingCheckAccountApiObject.currency,
        payments: null
      });
      resultingCheckAccount.sevdeskId = existingCheckAccountApiObject.id;
    }
    return resultingCheckAccount;
  }

  // Properties
  /**
   * the id given by sevdesk
   */
  sevdeskId: string;
  name: string;
  currency: TCurrency;
  payments: ITransaction[];

  constructor(optionsArg: ICheckingAccount) {
    for (let key in optionsArg) {
      if (optionsArg[key]) {
        this[key] = optionsArg[key];
      }
    }
  }

  /**
   * saves the checking account to a SevdeskAccount instance
   * @param sevdeskAccountArg
   */
  async save(sevdeskAccountArg: SevdeskAccount) {
    // the main payload expected by sevdesk api
    let payload: any = {
      name: this.name,
      type: 'apiAccount',
      currency: this.currency
    }


    if(!this.sevdeskId) {
      console.log(payload)
      const response = await sevdeskAccountArg.request('POST', '/CheckAccount', payload)
      console.log(response);
    } else {
      // TODO: if there is a sevdeskId assigned rather update this checkingaccount instead
    }
  }
}
