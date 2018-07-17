import * as plugins from './sevdesk.plugins';

import { SevdeskAccount } from './sevdesk.classes.account';
import {
  IContact,
  TContactSalutation,
  IAddress,
  TContactTitle,
  TContactType
} from '@tsclass/tsclass';

import * as contactHelpers from './helpers/country';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export class Contact implements IContact {
  /**
   * get contacts from Sevdesk
   * @param sevdeskAccount
   */
  static async getContacts(sevdeskAccount: SevdeskAccount) {
    const result = await sevdeskAccount.request('GET', '/Contacts', {});
    // TODO: propagate this to the class
  }

  /**
   * The internal sevdesk id
   */
  sevdeskId: string;

  // company or person
  type: TContactType;

  // Basic DATA
  title: TContactTitle;
  salutation: TContactSalutation;
  customerNumber: string;
  name: string;
  surname: string;

  // Contact Data
  address: IAddress;
  phone: string;
  email: string;

  description: string;

  // financeData
  accountNumber: string;
  vatId: string;

  constructor(contactObjectArg: IContact) {
    for (let key in contactObjectArg) {
      if (contactObjectArg[key]) {
        this[key] = contactObjectArg[key];
      }
    }
  }

  async save(sevdeskAccountArg: SevdeskAccount) {
    let payload: any;

    if (this.type === 'company') {
      payload = {
        name: this.name,
        bankNumber: this.accountNumber,
        vatNumber: this.vatId,
        description: this.description
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
      };
    }

    // add category information
    payload = {
      ...payload,
      category: {
        id: 3,
        objectName: 'Category'
      }
    };
    const contactResponseJson = await sevdeskAccountArg.request('POST', '/Contact', payload);
    this.sevdeskId = contactResponseJson.objects.id;
    // add address
    if (this.address) {
      const addressResponseJson = await sevdeskAccountArg.request(
        'POST',
        `/Contact/${this.sevdeskId}/addAddress`,
        {
          street: this.address.streetName,
          city: this.address.city,
          zip: this.address.postalCode,
          country: await contactHelpers.getCountryIdByCountryName(
            sevdeskAccountArg,
            this.address.country
          )
          // category: 'main'
        }
      );
    }

    // add email
    if (this.email) {
      const emailResponseJson = await sevdeskAccountArg.request(
        'POST',
        `/Contact/${this.sevdeskId}/addEmail`,
        {
          key: 1,
          value: this.email
        }
      );
    }

    // add phone
    if (this.phone) {
      const phoneResponseJson = await sevdeskAccountArg.request(
        'POST',
        `/Contact/${this.sevdeskId}/addPhone`,
        {
          key: 1,
          value: this.phone
        }
      );
    }
  }
}
