import { SevdeskAccount } from "./sevdesk.classes.account";
import { SevdeskTransaction } from './sevdesk.classes.transaction';

import { ICheckingAccount, TCurrency, ITransaction } from '@tsclass/tsclass';

export class SevdeskCheckingAccount implements ICheckingAccount {
  static async getAllCheckingAccount(sevdeskAccount: SevdeskAccount) {
    const resultingCheckingAccounts: SevdeskCheckingAccount[] = [];
    const response = await sevdeskAccount.request('GET', '/CheckAccount')
    
    for (let caApiObject of response.objects) {
      const sevdeskCA: SevdeskCheckingAccount = new SevdeskCheckingAccount({
        name: caApiObject.name,
        currency: caApiObject.currency,
        transactions: null
      });
      sevdeskCA.sevdeskId = caApiObject.id;
      sevdeskCA.transactions = await SevdeskTransaction.getTransactionsForCheckingAccountId(sevdeskAccount, sevdeskCA.sevdeskId);
      sevdeskCA.sevdeskAccount = sevdeskAccount;
      resultingCheckingAccounts.push(sevdeskCA);
    }
    return resultingCheckingAccounts
      
  }

  /**
   * gets a checkingAccount from sevdesk by name
   * @param sevdeskAccount
   * @param checkingAccountNameArg 
   */
  static async getCheckingAccountByName(
    sevdeskAccount: SevdeskAccount,
    checkingAccountNameArg: string
  ): Promise<SevdeskCheckingAccount> {
    let resultingCheckingAccount: SevdeskCheckingAccount;
    const checkingAccountsArray = await this.getAllCheckingAccount(sevdeskAccount);
    resultingCheckingAccount = checkingAccountsArray.find(checkingAccount => {
      return checkingAccount.name === checkingAccountNameArg
    })
    return resultingCheckingAccount;
  }

  // Properties
  /**
   * the sevdeskAccount this is from
   */
  sevdeskAccount: SevdeskAccount;
  /**
   * the id given by sevdesk
   */
  sevdeskId: string;
  name: string;
  currency: TCurrency;
  transactions: ITransaction[];

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
  async save(sevdeskAccountArg: SevdeskAccount = this.sevdeskAccount) {
    if(!this.sevdeskAccount) {
      this.sevdeskAccount = sevdeskAccountArg;
    }


    // the main payload expected by sevdesk api
    let payload: any = {
      name: this.name,
      type: 'online',
      currency: this.currency
    }


    if(!this.sevdeskId) {
      const response = await sevdeskAccountArg.request('POST', '/CheckAccount', payload);
      this.sevdeskId = response.objects.id;
      console.log(this.sevdeskId);
    } else {
      // TODO: if there is a sevdeskId assigned rather update this checkingaccount instead
    }
  }
}
