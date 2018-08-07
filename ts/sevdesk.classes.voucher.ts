import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';
import { SevdeskContact } from './sevdesk.classes.contact';

import { getAccountingIdByName } from './helpers/accountingtype';
import * as interfaces from './sevdesk.interfaces';

import { IExpense, IExpenseItem } from '@tsclass/tsclass';

import * as fs from 'fs';

export class SevdeskVoucher implements IExpense {
  expenseItems: IExpenseItem[];
  voucherFile: string; // the path to a voucherFile on disk
  contactRef: string;
  accountRef: string;
  accountingType: interfaces.TAccountingType;
  description: string;
  date: Date;
  supplierName: string;

  // getters
  get sum() {
    let sum = 0;
    for (let expense of this.expenseItems) {
      sum += expense.amount;
    }
    return sum;
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

  addExpenseItem(expenseItemArg: IExpenseItem) {
    this.expenseItems.push(expenseItemArg);
  }

  /**
   * saves the expense to Sevdesk
   */
  async save(sevdeskAccountArg: SevdeskAccount) {
    // lets try to save the pdf first
    let filenameForPayload: string = 'null';

    if (this.voucherFile) {
      console.log(this.voucherFile);
      const response = await sevdeskAccountArg.request(
        'POST',
        '/Voucher/Factory/uploadTempFile',
        fs.createReadStream(this.voucherFile),
        'pdf'
      );
      filenameForPayload = response.objects.filename;
    }
    console.log(filenameForPayload);

    // lets use the voucher factory
    const voucherPositions = [];
    for (let expense of this.expenseItems) {
      voucherPositions.push({
        sum: expense.amount,
        net: false,
        taxRate: expense.taxPercentage,
        objectName: 'VoucherPos'
      });
    }

    let accountingObject = await getAccountingIdByName(sevdeskAccountArg, 'Transport');
    //console.log(accountingObject);

    // lets save the actual voucher
    const voucherFactoryPayload = {
      voucher: {
        objectName: 'Voucher',
        mapAll: true,
        voucherDate: plugins.moment(this.date).format(),
        payDate: null,
        status: 100,
        comment: 'null',
        taxType: 'default',
        creditDebit: 'D',
        voucherType: 'VOU',
        total: this.sum
      },
      filename: filenameForPayload,
      voucherPosSave: (() => {
        const voucherPositions: any[] = [];
        for (const expenseItem of this.expenseItems) {
          const voucherPos = {
            sum: expenseItem.amount,
            net: 'false',
            taxRate: expenseItem.taxPercentage,
            objectName: 'VoucherPos',
            accountingType: 'null',
            comment: expenseItem.description,
            mapAll: 'true'
          };
          voucherPositions.push(voucherPos);
        }
        return voucherPositions;
      })(),
      voucherPosDelete: 'null'
      // supplier: SevdeskContact.getContactByName(sevdeskAccountArg, 'hi')
    };
    console.log(voucherFactoryPayload);
    await sevdeskAccountArg.request('POST', '/Voucher/Factory/saveVoucher', voucherFactoryPayload);
  }
}
