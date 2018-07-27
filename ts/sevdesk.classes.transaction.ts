import { SevdeskAccount } from './sevdesk.classes.account';
import { ITransaction } from '@tsclass/tsclass';

export class SevdeskTransaction implements ITransaction {
  static async getTransactionsForCheckingAccountId(sevdeskAccountArg: SevdeskAccount, checkingAccountId: string):Promise<SevdeskTransaction[]> {
    const response = await sevdeskAccountArg.request('GET', '/CheckAccountTransaction');
    console.log(response.objects);
    return [];
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
   * save the SevdeskTransaction to a SevdeskAccount
   */
  save() {

  }
}
