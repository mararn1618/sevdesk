import { SevdeskAccount } from './sevdesk.classes.account';
import { SevdeskTransaction, ISevdeskTransaction } from './sevdesk.classes.transaction';

import { finance } from '@tsclass/tsclass';
import { ICheckingAccount } from '@tsclass/tsclass/dist_ts/finance';

export class SevdeskCheckingAccount implements finance.ICheckingAccount {
  public static async getAllCheckingAccounts(sevdeskAccount: SevdeskAccount) {
    const resultingCheckingAccounts: SevdeskCheckingAccount[] = [];
    const response = await sevdeskAccount.request('GET', '/CheckAccount');

    for (const caApiObject of response.objects) {
      const sevdeskCA: SevdeskCheckingAccount = new SevdeskCheckingAccount({
        name: caApiObject.name,
        currency: caApiObject.currency,
        transactions: null,
      });
      sevdeskCA.sevdeskId = caApiObject.id;
      sevdeskCA.transactions = await SevdeskTransaction.getTransactionsForCheckingAccountId(
        sevdeskAccount,
        sevdeskCA.sevdeskId
      );
      sevdeskCA.sevdeskAccount = sevdeskAccount;
      resultingCheckingAccounts.push(sevdeskCA);
    }
    return resultingCheckingAccounts;
  }

  /**
   * gets a checkingAccount from sevdesk by name
   * @param sevdeskAccount
   * @param checkingAccountNameArg
   */
  public static async getCheckingAccountByName(
    sevdeskAccount: SevdeskAccount,
    checkingAccountNameArg: string
  ): Promise<SevdeskCheckingAccount> {
    let resultingCheckingAccount: SevdeskCheckingAccount;
    const checkingAccountsArray = await this.getAllCheckingAccounts(sevdeskAccount);
    resultingCheckingAccount = checkingAccountsArray.find((checkingAccount) => {
      return checkingAccount.name === checkingAccountNameArg;
    });
    return resultingCheckingAccount;
  }

  // Properties
  /**
   * the sevdeskAccount this is from
   */
  public sevdeskAccount: SevdeskAccount;
  /**
   * the id given by sevdesk
   */
  public sevdeskId: string;
  public name: string;
  public currency: finance.TCurrency;
  public transactions: finance.ITransaction[];

  constructor(optionsArg: ICheckingAccount) {
    for (const key in optionsArg) {
      if (optionsArg[key] || optionsArg[key] === 0) {
        this[key] = optionsArg[key];
      }
    }
  }

  /**
   * saves the checking account to a SevdeskAccount instance
   * @param sevdeskAccountArg
   */
  public async save(sevdeskAccountArg: SevdeskAccount = this.sevdeskAccount) {
    if (!this.sevdeskAccount) {
      this.sevdeskAccount = sevdeskAccountArg;
    }

    // the main payload expected by sevdesk api
    const payload: any = {
      name: this.name,
      type: 'online',
      currency: this.currency,
    };

    if (!this.sevdeskId) {
      const response = await sevdeskAccountArg.request('POST', '/CheckAccount', payload);
      this.sevdeskId = response.objects.id;
      // console.log(this.sevdeskId);
    } else {
      // TODO: if there is a sevdeskId assigned rather update this checkingaccount instead
    }
  }

  /**
   * creates a transaction on this account
   */
  public async createTransaction(optionsArg: ISevdeskTransaction) {
    const sevdeskTransaction = new SevdeskTransaction(optionsArg);
    await sevdeskTransaction.save(this.sevdeskAccount);
  }
}
