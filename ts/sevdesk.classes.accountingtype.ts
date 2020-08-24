import * as plugins from './sevdesk.plugins';
import { SevdeskAccount } from './sevdesk.classes.account';

export interface IAccountingType {
  sevdeskId: string;
  englishIdentifier: string;
}

export class SevdeskAccountingType implements IAccountingType {
  static async getAllAccountingTypes(
    sevdeskAccount: SevdeskAccount
  ): Promise<SevdeskAccountingType[]> {
    const response = await sevdeskAccount.request('GET', '/AccountingType?limit=2000');
    const returnArray: SevdeskAccountingType[] = [];
    for (const accountingTypeApiObject of response.objects) {
      if (!accountingTypeApiObject.translationCode) {
        continue;
      }

      // if we make it it means we have a translation code
      const splittedTranslationCode = accountingTypeApiObject.translationCode.split('_');
      let normalizedTranslationCode = '';
      for (let i = 2; i < splittedTranslationCode.length; i++) {
        normalizedTranslationCode += splittedTranslationCode[i];
        if (i + 1 < splittedTranslationCode.length) {
          normalizedTranslationCode += ' ';
        }
      }

      const accountingTypeInstance = new SevdeskAccountingType({
        sevdeskId: accountingTypeApiObject.id,
        englishIdentifier: normalizedTranslationCode,
      });
      returnArray.push(accountingTypeInstance);
    }
    return returnArray;
  }

  static async getByName(sevdeskAccountArg: SevdeskAccount, nameArg: string) {
    const accountingTypes = await SevdeskAccountingType.getAllAccountingTypes(sevdeskAccountArg);
    for (const accountingType of accountingTypes) {
      console.log(accountingType.englishIdentifier);
    }
    process.exit(0);
    return accountingTypes[0];
  }

  static async getByFuzzyName(sevdeskAccountArg: SevdeskAccount, nameArg: string) {
    const accountingTypes = await SevdeskAccountingType.getAllAccountingTypes(sevdeskAccountArg);
    const objectSorter = new plugins.smartfuzzy.ObjectSorter<SevdeskAccountingType>(
      accountingTypes
    );
    const sortedObject = objectSorter.sort(nameArg, ['englishIdentifier']);
    return sortedObject[0];
  }

  sevdeskId: string;
  englishIdentifier: string;

  /**
   * the constructor for a VoucherPosition
   */
  constructor(optionsArg: IAccountingType) {
    for (let key in optionsArg) {
      if (optionsArg[key] || optionsArg[key] === 0) {
        this[key] = optionsArg[key];
      }
    }
  }
}
