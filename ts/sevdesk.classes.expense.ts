import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';

import { IExpense, IExpenseItem } from '@tsclass/tsclass';

import * as fs from 'fs';

export class Expense implements IExpense {
  expenseItems: IExpenseItem[];
  voucherFile: any;
  contactRef: string;
  accountRef: string;

  /**
   * the contructor for an Expense
   */
  constructor(expenseObjectArg: IExpense) {
    for (let key in expenseObjectArg) {
      if (expenseObjectArg[key]) {
        this[key] = expenseObjectArg[key];
      }
    }
  }

  /**
   * saves the expense to Sevdesk
   */
  async save(accountArg: SevdeskAccount) {

    // lets try to save the pdf first
    const response = await accountArg.request('POST', '/Voucher/Factory/uploadTempFile', fs.createReadStream(this.voucherFile), 'file');
    console.log(response);
  }
}
