import { expect, tap } from '@pushrocks/tapbundle';
import * as sevdesk from '../ts';

import * as qenv from '@pushrocks/qenv';

const testQenv = new qenv.Qenv('./', './.nogit');

let testSevdeskAccount: sevdesk.SevdeskAccount;
let sevDeskTestContact: sevdesk.SevdeskContact;

tap.test('should create a sevdeskAccount', async () => {
  testSevdeskAccount = new sevdesk.SevdeskAccount(testQenv.getEnvVarOnDemand('SEVDESK_TOKEN'));
  expect(testSevdeskAccount).to.be.instanceof(sevdesk.SevdeskAccount);
});

tap.test('should get all available booking types', async () => {
  const allAccountingTypes = await sevdesk.SevdeskAccountingType.getAllAccountingTypes(
    testSevdeskAccount
  );
});

tap.test('should create contact with type person', async () => {
  sevDeskTestContact = new sevdesk.SevdeskContact({
    title: 'Doctor',
    customerNumber: '1000',
    name: 'Toni',
    surname: 'Stark',
    type: 'person',
    address: {
      streetName: 'Stark Industries Loop',
      postalCode: '10000',
      city: 'New York',
      country: 'Germany',
      houseNumber: '6',
    },
    email: 'tony@starkindustries.com',
    phone: '+1 646 822 4567',
    description: 'Toni is an entrepreneur and a natural Person',
  });
  await sevDeskTestContact.save(testSevdeskAccount);
  console.log(sevDeskTestContact);
  expect(sevDeskTestContact).to.haveOwnProperty('sevdeskId');
});

tap.test('should create contact with type company', async () => {
  sevDeskTestContact = new sevdesk.SevdeskContact({
    customerNumber: '1001',
    name: 'Start Technologies',
    type: 'company',
    address: {
      streetName: 'Stark Industries Loop',
      postalCode: '10000',
      city: 'New York',
      country: 'Malta',
      houseNumber: '7',
    },
    email: 'office@starkindustries.com',
    phone: '+1 646 822 4567',
    description: 'Stark Technologies is a company',
  });
  await sevDeskTestContact.save(testSevdeskAccount);
});

tap.test('should create a valid voucher with PDF file', async () => {
  const voucher = await testSevdeskAccount.createVoucher({
    date: new Date(),
    description: 'a cool expense',
    contactRef: sevDeskTestContact,
    expenseItems: [
      {
        accountingType: await sevdesk.SevdeskAccountingType.getByFuzzyName(
          testSevdeskAccount,
          'Train Ticket'
        ),
        amount: 119,
        asset: false,
        description: 'traveling with Deutsche Bahn',
        taxPercentage: 19,
      },
    ],
    voucherFilePath: './test/testvoucher.pdf',
  });
});

tap.skip.test('should create a valid checking account', async () => {
  const myCheckingAccount = testSevdeskAccount.createCheckingAccount({
    currency: 'EUR',
    name: 'SomeAccount'
  });
});

tap.test('should create a valid checking account and store a transaction', async () => {
  const myCheckingAccount = await testSevdeskAccount.createCheckingAccount({
    name: 'sevdeskmodule',
    currency: 'EUR'
  });
  myCheckingAccount.createTransaction({
    amount: 100,
    date: new Date(),
    description: 'an awesome transaction',
    name: 'some name',
    payeeName: 'some name',
    status: 'unpaid'
  });
});

tap.skip.test('should get transactions for an account', async () => {
  const myCheckingAccount = await sevdesk.SevdeskCheckingAccount.getCheckingAccountByName(
    testSevdeskAccount,
    'Commerzbank'
  );
  myCheckingAccount;
});

tap.start();
