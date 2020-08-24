import * as plugins from './sevdesk.plugins';

import { SevdeskAccount } from './sevdesk.classes.account';
import {
  business,
} from '@tsclass/tsclass';

export interface ISevdeskContact extends business.IContact {
  sevdeskId?: string;
}

import * as contactHelpers from './helpers/country';
import { ENGINE_METHOD_DIGESTS } from 'constants';

export class SevdeskContact implements business.IContact {
  private static fromSevdeskApiObject(sevdeskApiObject: any): SevdeskContact {
    let sevdeskId: string;
    let type: business.TContactType;
    let name: string;
    let surname: string;
    let email: string;
    let address: business.IAddress;
    let description: string;

    // lets determine the contact type
    if (sevdeskApiObject.name && !sevdeskApiObject.familyname) {
      type = 'company';
      name = sevdeskApiObject.name;
    } else {
      type = 'person';
      name = 'name';
      surname = surname;
    }

    // always
    sevdeskId = sevdeskApiObject.id;

    const sevdeskContactInstance = new SevdeskContact({
      sevdeskId: sevdeskId,
      type: type,
      name: name,
      surname: surname,
      address: address,
      description: description,
    });

    return sevdeskContactInstance;
  }

  /**
   * get contacts from Sevdesk
   * @param sevdeskAccount
   */
  static async getAllContacts(sevdeskAccount: SevdeskAccount): Promise<SevdeskContact[]> {
    const result = await sevdeskAccount.request('GET', '/Contact');
    const resultContactArray: SevdeskContact[] = [];
    for (let contactApiObject of result.objects) {
      const sevdeskContact = SevdeskContact.fromSevdeskApiObject(contactApiObject);
      resultContactArray.push(sevdeskContact);
    }
    return resultContactArray;
  }

  static async getContactByFuzzyName(sevdeskAccount: SevdeskAccount, nameArg: string) {
    const resultContactArray = await SevdeskContact.getAllContacts(sevdeskAccount);
    const objectSorter = new plugins.smartfuzzy.ObjectSorter<SevdeskContact>(resultContactArray);
    const sortedContactArray = objectSorter.sort(nameArg, ['name', 'surname']);
    return sortedContactArray[0];
  }

  /**
   * The internal sevdesk id
   */
  sevdeskId: string;

  // company or person
  type: business.TContactType;

  // Basic DATA
  title: business.TContactTitle;
  salutation: business.TContactSalutation;
  customerNumber: string;
  name: string;
  surname: string;

  // Contact Data
  address: business.IAddress;
  phone: string;
  email: string;

  description: string;

  // financeData
  accountNumber: string;
  vatId: string;

  constructor(optionsArg: ISevdeskContact) {
    for (let key in optionsArg) {
      if (optionsArg[key] || optionsArg[key] === 0) {
        this[key] = optionsArg[key];
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
        vatNumber: this.vatId,
      };
    }

    // add category information
    payload = {
      ...payload,
      category: {
        id: 3,
        objectName: 'Category',
      },
    };

    if (!this.sevdeskId) {
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
            ),
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
            value: this.email,
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
            value: this.phone,
          }
        );
      }
    } else {
      // TODO if there is a sevdeskId assigned rather update than creating a new contact
    }
  }
}
