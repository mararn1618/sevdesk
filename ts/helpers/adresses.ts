import { SevdeskAccount } from '../sevdesk.classes.account';

export const getAddressesByContactId = async (
  sevdeskAccount: SevdeskAccount,
  contactId: string
): Promise<any> => {
  const contactApiObject = sevdeskAccount.request('GET', `/Contact/${contactId}/getAddresses`);
  return contactApiObject;
};
