import { SevdeskAccount } from './sevdesk.classes.account';
import { finance } from '@tsclass/tsclass';
import { SevdeskCheckingAccount } from './sevdesk.classes.checkingaccount';

import * as plugins from './sevdesk.plugins';

export interface ISevdeskTransaction extends finance.ITransaction {
  sevdeskId?: string;
  payeeName: string;
  status: 'paid' | 'unpaid';
}

export class SevdeskTransaction implements ISevdeskTransaction {
  public static async getTransactionsForCheckingAccount(
    sevdeskCheckingAccountArg: SevdeskCheckingAccount
  ): Promise<SevdeskTransaction[]> {
    const response = await sevdeskCheckingAccountArg.sevdeskAccount.request(
      'GET',
      '/CheckAccountTransaction'
    );
    const apiObjectArray = response.objects;
    const returnArray: SevdeskTransaction[] = [];
    for (const transactionData of apiObjectArray) {
      returnArray.push(new SevdeskTransaction(sevdeskCheckingAccountArg, transactionData));
    }
    return returnArray;
  }

  public checkingAccount: SevdeskCheckingAccount;
  public name: string;

  public date: Date;
  public status: 'paid' | 'unpaid';
  public description: string;
  public amount: number;
  public payeeName: string;
  public sevdeskId: string;

  /**
   * the constructor for SevdeskTransaction
   * @param optionsArg
   */
  constructor(checkingAccountArg: SevdeskCheckingAccount, optionsArg: ISevdeskTransaction) {
    this.checkingAccount = checkingAccountArg;
    Object.assign(this, optionsArg);
  }

  /**
   * save the SevdeskTransaction to a SevdeskAccount
   */
  public async save() {
    const payloadStatus = (() => {
      if (this.status === 'paid') {
        return '200';
      }
      return '100';
    })();
    const payload = {
      valueDate: plugins.smarttime.ExtendedDate.fromDate(this.date).toISOString(),
      entryDate: plugins.smarttime.ExtendedDate.fromDate(this.date).toISOString(),
      amount: this.amount,
      paymtPurpose: this.description,
      payeePayerName: this.payeeName,
      status: payloadStatus,
      checkAccount: {
        id: this.checkingAccount.sevdeskId,
        objectName: 'CheckAccount',
      },
    };
    // console.log(payload)
    const response = await this.checkingAccount.sevdeskAccount.request(
      'POST',
      '/CheckAccountTransaction',
      payload
    );
    this.sevdeskId = response.objects.id;
  }
}
