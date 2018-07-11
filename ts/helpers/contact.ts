import { SevdeskAccount } from '../sevdesk.classes.account';

export let getCountryIdByCountryName = async (sevdeskAccount: SevdeskAccount, countryNameArg: string) => {
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

export let getCountryNameByCountryId = async (sevdeskAccount: SevdeskAccount) => {
  
}
