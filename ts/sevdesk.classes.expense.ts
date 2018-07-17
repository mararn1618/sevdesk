import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';

import { IExpense, IExpenseItem } from '@tsclass/tsclass';

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
  save(accountArg: SevdeskAccount) {
    // lets try to save the pdf first
    accountArg.request('POST', '/Voucher/Factory/uploadTempFile');
  }
}
