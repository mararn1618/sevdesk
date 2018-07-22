import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';
import { SevdeskContact } from './sevdesk.classes.contact';

import { getAccountingIdByName } from './helpers/accountingtype'
import * as interfaces from './sevdesk.interfaces';

import { IExpense, IExpenseItem } from '@tsclass/tsclass';

import * as fs from 'fs';

export class SevdeskExpense implements IExpense {
  expenseItems: IExpenseItem[];
  voucherFile: string; // the path to a voucherFile on disk
  contactRef: string;
  accountRef: string;
  accountingType: interfaces.TAccountingType

  sevDeskData: {
    filename?: string;
  } = {}

  // getters
  get sum () {
    let sum = 0
    for (let expense of this.expenseItems) {
      sum += expense.amount
    }
    return sum
  }


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
  async save(sevdeskAccountArg: SevdeskAccount) {

    // lets try to save the pdf first
    const response = await sevdeskAccountArg.request('POST', '/Voucher/Factory/uploadTempFile', fs.createReadStream(this.voucherFile), 'pdf');
    this.sevDeskData.filename = response.objects.filename;
    console.log(this.sevDeskData.filename);
    const voucherPositions = [];
    for (let expense of this.expenseItems) {
      voucherPositions.push({
        sum: expense.amount,
        net: false,
        taxRate: expense.taxPercentage,
        objectName: 'VoucherPos',
        
      })
    }

    let accountingObject = await getAccountingIdByName(sevdeskAccountArg, 'Transport');
    //console.log(accountingObject);

    // lets save the actual voucher
    const voucherPayload = {
      objectName: 'Voucher',
      mapAll: true,
      voucherDate: (new Date()).toUTCString(),
      payDate: null,
      status: 100,
      comment: 'null',
      taxType: 'default',
      creditDebit: 'D',
      voucherType: 'VOU',
      total: this.sum,
      supplier: SevdeskContact.getContactByName(sevdeskAccountArg, 'hi')
    }
  }
}
