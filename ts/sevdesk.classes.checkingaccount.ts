import { SevdeskAccount } from './sevdesk.classes.account';
import { SevdeskTransaction, ISevdeskTransaction } from './sevdesk.classes.transaction';

import { finance } from '@tsclass/tsclass';
import { ICheckingAccount } from '@tsclass/tsclass/dist_ts/finance';

export class SevdeskCheckingAccount implements finance.ICheckingAccount {
  public static async getAllCheckingAccounts(sevdeskAccountArg: SevdeskAccount) {
    const resultingCheckingAccounts: SevdeskCheckingAccount[] = [];
    const response = await sevdeskAccountArg.request('GET', '/CheckAccount');

    for (const caApiObject of response.objects) {
      const sevdeskCA: SevdeskCheckingAccount = new SevdeskCheckingAccount(sevdeskAccountArg, {
        name: caApiObject.name,
        currency: caApiObject.currency
      });
      sevdeskCA.sevdeskId = caApiObject.id;
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

  /**
   * creates a checking account
   * @param sevdeskAccountArg
   * @param optionsArg
   */
  public static async createCheckingAccount(
    sevdeskAccountArg: SevdeskAccount,
    optionsArg: ICheckingAccount
  ) {
    const newCheckingAccount = new SevdeskCheckingAccount(sevdeskAccountArg, optionsArg);
    await newCheckingAccount.save();
    return newCheckingAccount;
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

  constructor(sevdeskAccountArg: SevdeskAccount, optionsArg: ICheckingAccount) {
    this.sevdeskAccount = sevdeskAccountArg;
    Object.assign(this, optionsArg);
  }

  /**
   * saves the checking account to a SevdeskAccount instance
   * @param sevdeskAccountArg
   */
  public async save() {
    // the main payload expected by sevdesk api
    const payload: any = {
      name: this.name,
      type: 'online',
      importType: 'CSV',
      currency: this.currency,
    };

    if (!this.sevdeskId) {
      const response = await await this.sevdeskAccount.request('POST', '/CheckAccount', payload);
      this.sevdeskId = response.objects.id;
    } else {
      // TODO: if there is a sevdeskId assigned rather update this checkingaccount instead
    }
  }

  /**
   * creates a transaction on this account
   */
  public async createTransaction(optionsArg: ISevdeskTransaction) {
    const sevdeskTransaction = new SevdeskTransaction(this, optionsArg);
    await sevdeskTransaction.save();
    return sevdeskTransaction;
  }
}
