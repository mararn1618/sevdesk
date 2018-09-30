import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';
import { SevdeskContact } from './sevdesk.classes.contact';
import { SevdeskAccountingType } from './sevdesk.classes.accountingtype';
import * as interfaces from './sevdesk.interfaces';

import { IVoucher, IExpenseItem } from '@tsclass/tsclass';

export interface ISevdeskVoucher extends IVoucher {
  accountRef: SevdeskAccount,
  contactRef: SevdeskContact;
  expenseItems: ISevdeskExpenseItem[];
  voucherFilePath: string;
}

export interface ISevdeskExpenseItem extends IExpenseItem {
  accountingType: SevdeskAccountingType;
}

import * as fs from 'fs';
import { VoucherPosition } from './helpers/voucherposition';

export class SevdeskVoucher implements ISevdeskVoucher {
  /**
   * expense items describe 
   */
  expenseItems: ISevdeskExpenseItem[] = [];

  /**
   * path to the voucher file on disk
   */
  voucherFilePath: string;

  /**
   * contactRef
   */
  contactRef: SevdeskContact;

  /**
   * 
   */
  accountRef: SevdeskAccount;
  accountingType: interfaces.TAvailableAccountingType;
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
  constructor(expenseObjectArg: ISevdeskVoucher) {
    for (let key in expenseObjectArg) {
      if (expenseObjectArg[key] || expenseObjectArg[key] === 0) {
        this[key] = expenseObjectArg[key];
      }
    }
  }

  addExpenseItem(expenseItemArg: ISevdeskExpenseItem) {
    this.expenseItems.push(expenseItemArg);
  }

  setContactRef(contactArg: SevdeskContact) {
    this.contactRef = contactArg;
  }

  /**
   * saves the expense to Sevdesk
   */
  async save(sevdeskAccountArg: SevdeskAccount) {
    // lets try to save the pdf first
    let filenameForPayload: string = 'null';

    if (this.voucherFilePath) {
      console.log(this.voucherFilePath);
      const response = await sevdeskAccountArg.request(
        'POST',
        '/Voucher/Factory/uploadTempFile',
        this.voucherFilePath,
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

    // lets save the actual voucher
    const voucherFactoryPayload: any = {
      voucher: {
        objectName: 'Voucher',
        mapAll: true,
        voucherDate: plugins.moment(this.date).format(),
        paymentDeadline: plugins.moment(this.date).format(),
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
          const voucherPos = new VoucherPosition({
            accountingType: expenseItem.accountingType,
            amount: expenseItem.amount,
            taxPercentage: expenseItem.taxPercentage,
            asset: false,
            description: expenseItem.description
          })
          voucherPositions.push(voucherPos.getFormatedObjectForApi());
        }
        return voucherPositions;
      })(),
      voucherPosDelete: 'null'
      // supplier: SevdeskContact.getContactByName(sevdeskAccountArg, 'hi')
    };
    if(this.contactRef) {
      voucherFactoryPayload.voucher.supplier = {
        objectName: 'Contact',
        id: this.contactRef.sevdeskId
      },
      voucherFactoryPayload.supplierNameAtSave = this.contactRef.name;
    };
    console.log(voucherFactoryPayload);
    console.log('jo')
    await sevdeskAccountArg.request('POST', '/Voucher/Factory/saveVoucher', voucherFactoryPayload);
  }
}
