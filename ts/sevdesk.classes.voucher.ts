import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';
import { SevdeskContact } from './sevdesk.classes.contact';
import { SevdeskAccountingType } from './sevdesk.classes.accountingtype';
import * as interfaces from './sevdesk.interfaces';

import { finance } from '@tsclass/tsclass';

export interface ISevdeskVoucherOptions extends finance.IVoucher {
  contactRef: SevdeskContact;
  expenseItems: ISevdeskExpenseItem[];
  voucherFilePath: string;
}

export interface ISevdeskExpenseItem extends finance.IExpenseItem {
  accountingType: SevdeskAccountingType;
}

import * as fs from 'fs';
import { VoucherPosition } from './helpers/voucherposition';

export class SevdeskVoucher implements ISevdeskVoucherOptions {
  // STATIC
  public static async createVoucher(sevdeskAccountRef: SevdeskAccount, voucherOptionsArg: ISevdeskVoucherOptions) {
    const voucher = new SevdeskVoucher(sevdeskAccountRef, voucherOptionsArg);
    await voucher.save();
    return voucher;
  }

  // INSTANCE
  public sevdeskAccountRef: SevdeskAccount;
  
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
  accountingType: interfaces.TAvailableAccountingType;
  description: string;
  date: Date;
  supplierName: string;

  // getters
  get sum() {
    let sum = 0;
    for (const expense of this.expenseItems) {
      sum += expense.amount;
    }
    return sum;
  }

  /**
   * the contructor for an Expense
   */
  constructor(sevdeskAccountRefArg: SevdeskAccount, expenseObjectArg: ISevdeskVoucherOptions) {
    this.sevdeskAccountRef = sevdeskAccountRefArg;
    Object.assign(this, expenseObjectArg);
  }

  public addExpenseItem(expenseItemArg: ISevdeskExpenseItem) {
    this.expenseItems.push(expenseItemArg);
  }

  /**
   * saves the expense to Sevdesk
   */
  public async save() {
    // lets try to save the pdf first
    let filenameForPayload: string = 'null';

    if (this.voucherFilePath) {
      console.log(this.voucherFilePath);
      const response = await this.sevdeskAccountRef.request(
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
    for (const expense of this.expenseItems) {
      voucherPositions.push({
        sum: expense.amount,
        net: false,
        taxRate: expense.taxPercentage,
        objectName: 'VoucherPos',
      });
    }

    // lets save the actual voucher
    const voucherFactoryPayload: any = {
      voucher: {
        objectName: 'Voucher',
        mapAll: true,
        voucherDate: plugins.smarttime.ExtendedDate.fromDate(this.date).toISOString(),
        paymentDeadline: plugins.smarttime.ExtendedDate.fromDate(this.date).toISOString(),
        payDate: null,
        status: 100,
        comment: 'null',
        taxType: 'default',
        creditDebit: 'C',
        voucherType: 'VOU',
        total: this.sum,
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
            description: expenseItem.description,
          });
          voucherPositions.push(voucherPos.getFormatedObjectForApi());
        }
        return voucherPositions;
      })(),
      voucherPosDelete: 'null',
      // supplier: SevdeskContact.getContactByName(sevdeskAccountArg, 'hi')
    };
    if (this.contactRef) {
      voucherFactoryPayload.voucher.supplier = {
        objectName: 'Contact',
        id: this.contactRef.sevdeskId,
      };
      voucherFactoryPayload.supplierNameAtSave = this.contactRef.name;
    }
    // console.log(voucherFactoryPayload);
    await this.sevdeskAccountRef.request('POST', '/Voucher/Factory/saveVoucher', voucherFactoryPayload);
  }
}
