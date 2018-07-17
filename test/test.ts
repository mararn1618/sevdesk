import { expect, tap } from '@pushrocks/tapbundle';
import * as sevdesk from '../ts';

import * as qenv from 'qenv';

const testQenv = new qenv.Qenv('./', './.nogit');

let sevDeskAccount: sevdesk.SevdeskAccount;
let sevDeskContact: sevdesk.Contact;

tap.test('should create a sevdeskAccount', async () => {
  sevDeskAccount = new sevdesk.SevdeskAccount(process.env.SEVDESK_TOKEN);
  expect(sevDeskAccount).to.be.instanceof(sevdesk.SevdeskAccount);
});

tap.test('should create contact with type person', async () => {
  sevDeskContact = new sevdesk.Contact({
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
      houseNumber: '6'
    },
    email: 'tony@starkindustries.com',
    phone: '+1 646 822 4567',
    description: 'Toni is an entrepreneur and a natural Person'
  });
  await sevDeskContact.save(sevDeskAccount);
});

tap.test('should create contact with type company', async () => {
  sevDeskContact = new sevdesk.Contact({
    customerNumber: '1001',
    name: 'Start Technologies',
    type: 'company',
    address: {
      streetName: 'Stark Industries Loop',
      postalCode: '10000',
      city: 'New York',
      country: 'Malta',
      houseNumber: '7'
    },
    email: 'office@starkindustries.com',
    phone: '+1 646 822 4567',
    description: 'Stark Technologies is a company'
  });
  await sevDeskContact.save(sevDeskAccount);
});

tap.test('should create an expense with PDF file', async () => {
  const expense = new sevdesk.Expense({
    accountRef: null,
    voucherFile: null,
    contactRef: null,
    expenseItems: []
  });
});

tap.start();
