import { SevdeskAccount } from '../sevdesk.classes.account';

export const getCountryIdByCountryName = async (sevdeskAccount: SevdeskAccount, countryNameArg: string) => {
  const response = await sevdeskAccount.request('GET', `/StaticCountry`);
  const countryArrray = response.objects;

  const countryId = countryArrray.find(countryObjectArg => {
    return countryObjectArg.nameEn === countryNameArg
  }).id
  return {
    id: countryId,
    objectName: 'StaticCountry'
  }
}

export const getCountryNameByCountryId = async (sevdeskAccount: SevdeskAccount) => {
  
}
