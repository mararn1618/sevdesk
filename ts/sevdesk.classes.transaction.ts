import { SevdeskAccount } from './sevdesk.classes.account';
import { ITransaction } from '@tsclass/tsclass';

export class SevdeskTransaction implements ITransaction {
  static async getTransactionsForCheckingAccountId(sevdeskAccountArg: SevdeskAccount, checkingAccountId: string) {
    const response = await sevdeskAccountArg.request('GET', '/CheckAccountTransaction');
    console.log(response.objects);
  };
  amount: number;
  date: Date;
  constructor(optionsArg: ITransaction) {
    for (let key in optionsArg) {
      if (optionsArg[key]) {
        this[key] = optionsArg[key];
      }
    }
  }

  /**
   * gets all Transactions associated with the checking account
   */
  getTransactions() {
    
  }

  /**
   * save the SevdeskTransaction to a SevdeskAccount
   */
  save() {

  }
}
