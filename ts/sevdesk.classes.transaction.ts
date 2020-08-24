import { SevdeskAccount } from './sevdesk.classes.account';
import { ITransaction } from '@tsclass/tsclass';
import { SevdeskCheckingAccount } from './sevdesk.classes.checkingaccount';

import * as plugins from './sevdesk.plugins';

export interface ISevdeskTransaction extends ITransaction {
  sevdeskId?: string;
  sevdeskCheckingAccountId?: string;
  payeeName: string;
  status: 'paid' | 'unpaid';
}

export class SevdeskTransaction implements ISevdeskTransaction {
  public static async getTransactionsForCheckingAccountId(
    sevdeskAccountArg: SevdeskAccount,
    checkingAccountId: string
  ): Promise<SevdeskTransaction[]> {
    const response = await sevdeskAccountArg.request('GET', '/CheckAccountTransaction');
    const apiObjectArray = response.objects;
    // console.log(apiObjectArray);
    return [];
  }

  public name: string;

  public date: Date;
  public status: 'paid' | 'unpaid';
  public description: string;
  public amount: number;
  public payeeName: string;
  public sevdeskId: string;
  public sevdeskCheckingAccountId: string;

  /**
   * the constructor for SevdeskTransaction
   * @param optionsArg
   */
  constructor(optionsArg: ISevdeskTransaction) {
    for (const key in optionsArg) {
      if (optionsArg[key] || optionsArg[key] === 0) {
        this[key] = optionsArg[key];
      }
    }
  }

  /**
   * save the SevdeskTransaction to a SevdeskAccount
   */
  public async save(sevdeskAccountArg: SevdeskAccount) {
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
        id: this.sevdeskCheckingAccountId,
        objectName: 'CheckAccount'
      }
    };
    // console.log(payload)
    const response = await sevdeskAccountArg.request('POST', '/CheckAccountTransaction', payload);
    this.sevdeskId = response.id;
  }
}
