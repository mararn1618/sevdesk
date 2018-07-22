/**
 * Country is a reference to a country
 */

import { SevdeskAccount } from '../sevdesk.classes.account';

export const getCountryIdByCountryName = async (
  sevdeskAccount: SevdeskAccount,
  countryNameArg: string
) => {
  const response = await sevdeskAccount.request('GET', `/StaticCountry?limit=1000`);
  const countryArrray = response.objects;

  const countryId = countryArrray.find(countryObjectArg => {
    return countryObjectArg.nameEn === countryNameArg;
  }).id;
  // console.log(countryId);
  return {
    id: countryId,
    objectName: 'StaticCountry'
  };
};

export const getCountryNameByCountryId = async (sevdeskAccount: SevdeskAccount) => {};
