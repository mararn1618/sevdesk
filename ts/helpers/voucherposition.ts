import * as plugins from '../sevdesk.plugins';
import { SevdeskAccountingType } from '../sevdesk.classes.accountingtype';

export interface IVoucherPosition {
  /**
   * the amount of the voucher position
   * If negative it will be multiplied with -1
   */
  amount: number;
  taxPercentage: number;
  asset: boolean;
  description: string;
  accountingType: SevdeskAccountingType;
}

/**
 * a helper class for a voucher position
 */
export class VoucherPosition implements IVoucherPosition {
  amount: number;
  taxPercentage: number;
  asset: boolean;
  description: string;
  accountingType: SevdeskAccountingType;

  /**
   * the constructor for a VoucherPosition
   */
  constructor(options: IVoucherPosition) {
    for (let key in options) {
      if (options[key] || options[key] === 0) {
        this[key] = options[key];
      }
    }
  }

  getFormatedObjectForApi() {
    const sum = this.amount * (100 / (100 + this.taxPercentage));
    console.log(sum);
    const returnObject = {
      sum: sum,
      net: 'false',
      taxRate: this.taxPercentage,
      objectName: 'VoucherPos',
      accountingType: {
        id: this.accountingType.sevdeskId,
        objectName: 'AccountingType'
      },
      comment: this.description,
      mapAll: 'true'
    };
    return returnObject;
  }
}
