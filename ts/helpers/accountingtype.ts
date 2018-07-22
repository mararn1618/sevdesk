import { SevdeskAccount } from '../sevdesk.classes.account'

/**
 * accountingtype is a reference to how an entry is booked
 */
export const getAccountingIdByName = async (sevdeskAccount: SevdeskAccount, accountTypeNameArg: string) => {
  const response = await sevdeskAccount.request('GET', '/AccountingType?limit=2000');
  const wantedAccountingType = response.objects.find(accountingType => {
    return accountingType.name === accountTypeNameArg;
  });
  return wantedAccountingType;
};
