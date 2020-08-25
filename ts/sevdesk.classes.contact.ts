import * as plugins from './sevdesk.plugins';

import { SevdeskAccount } from './sevdesk.classes.account';
import {
  business,
} from '@tsclass/tsclass';

export interface ISevdeskContactOptions extends business.IContact {
  sevdeskId?: string;
}

import * as contactHelpers from './helpers/country';

export class SevdeskContact implements business.IContact {
  public static async createSevdeskTransaction(sevdeskAccountRefArg: SevdeskAccount, sevdeskContactOptionsArg: ISevdeskContactOptions) {
    const sevdeskContact = new SevdeskContact(sevdeskAccountRefArg, sevdeskContactOptionsArg);
    await sevdeskContact.save();
    return sevdeskContact;
  }

  private static fromSevdeskApiObject(sevdeskAccountArg: SevdeskAccount, sevdeskApiObject: any): SevdeskContact {
    let sevdeskId: string;
    let type: business.TContactType;
    let name: string;
    let surname: string;
    let address: any;
    let description: any;

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

    const sevdeskContactInstance = new SevdeskContact(sevdeskAccountArg, {
      sevdeskId,
      type,
      name,
      surname,
      address,
      description
    });

    return sevdeskContactInstance;
  }

  /**
   * get contacts from Sevdesk
   * @param sevdeskAccountRefArg
   */
  static async getAllContacts(sevdeskAccountRefArg: SevdeskAccount): Promise<SevdeskContact[]> {
    const result = await sevdeskAccountRefArg.request('GET', '/Contact');
    const resultContactArray: SevdeskContact[] = [];
    for (const contactApiObject of result.objects) {
      const sevdeskContact = SevdeskContact.fromSevdeskApiObject(sevdeskAccountRefArg, contactApiObject);
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

  // INSTANCE
  public sevdeskAccountRef: SevdeskAccount;

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

  constructor(sevdeskAccountArg: SevdeskAccount, optionsArg: ISevdeskContactOptions) {
    this.sevdeskAccountRef = sevdeskAccountArg;
    Object.assign(this, optionsArg);
  }

  async save() {
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
      const contactResponseJson = await this.sevdeskAccountRef.request('POST', '/Contact', payload);
      this.sevdeskId = contactResponseJson.objects.id;
      // add address
      if (this.address) {
        const addressResponseJson = await this.sevdeskAccountRef.request(
          'POST',
          `/Contact/${this.sevdeskId}/addAddress`,
          {
            street: this.address.streetName,
            city: this.address.city,
            zip: this.address.postalCode,
            country: await contactHelpers.getCountryIdByCountryName(
              this.sevdeskAccountRef,
              this.address.country
            ),
            // category: 'main'
          }
        );
      }

      // add email
      if (this.email) {
        const emailResponseJson = await this.sevdeskAccountRef.request(
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
        const phoneResponseJson = await this.sevdeskAccountRef.request(
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
