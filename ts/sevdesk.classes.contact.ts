import * as plugins from "./sevdesk.plugins";

import { SevdeskAccount } from "./sevdesk.classes.account";
import {
  IContact,
  TContactSalutation,
  IAddress,
  TContactTitle,
  TContactType
} from "@tsclass/tsclass";

export class Contact implements IContact {
  /**
   * get contacts from Sevdesk
   * @param sevdeskAccount
   */
  static async getContacts(sevdeskAccount: SevdeskAccount) {
    const result = await sevdeskAccount.request("GET", "/Contacts", {});
  }

  // DATA
  customerNumber: string;
  salutation: TContactSalutation;
  name: string;
  surname: string;
  address: IAddress;
  title: TContactTitle;
  type: TContactType;
  accountNumber: string;
  vatId: string;
  description: string;
  constructor(contactObjectArg: IContact) {
    for (let key in contactObjectArg) {
      if (contactObjectArg[key]) {
        this[key] = contactObjectArg[key];
      }
    }
  }

  async save(sevdeskAccountArg: SevdeskAccount) {
    let payload: any;

    if (this.type === "company") {
      payload = {
        name: this.name,
        bankNumber: this.accountNumber,
        vatNumber: this.vatId,
        description: this.description,
      };
    } else if (this.type === 'person') {
      payload = {
        familyname: this.surname,
        surename: this.name,
        name2: this.name,
        customerNumber: this.customerNumber,
        academicTitle: this.title,
        bankNumber: this.accountNumber,
        vatNumber: this.vatId
      }
    }

    // add category information
    payload = {
      ...payload,
      category: {
        id: 3,
        objectName: "Category"
      }
    }
    console.log(payload);
    await sevdeskAccountArg.request("POST", "/Contact", payload);
  }
}
