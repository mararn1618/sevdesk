# sevdesk

mojoio integration package for sevdesk

## Availabililty

[![npm](https://mojoio.gitlab.io/assets/repo-button-npm.svg)](https://www.npmjs.com/package/@mojoio/sevdesk)
[![git](https://mojoio.gitlab.io/assets/repo-button-git.svg)](https://GitLab.com/mojoio/sevdesk)
[![git](https://mojoio.gitlab.io/assets/repo-button-mirror.svg)](https://github.com/mojoio/sevdesk)
[![docs](https://mojoio.gitlab.io/assets/repo-button-docs.svg)](https://mojoio.gitlab.io/sevdesk/)

## Status for master

[![build status](https://GitLab.com/mojoio/sevdesk/badges/master/build.svg)](https://GitLab.com/mojoio/sevdesk/commits/master)
[![coverage report](https://GitLab.com/mojoio/sevdesk/badges/master/coverage.svg)](https://GitLab.com/mojoio/sevdesk/commits/master)
[![npm downloads per month](https://img.shields.io/npm/dm/@mojoio/sevdesk.svg)](https://www.npmjs.com/package/@mojoio/sevdesk)
[![Known Vulnerabilities](https://snyk.io/test/npm/@mojoio/sevdesk/badge.svg)](https://snyk.io/test/npm/@mojoio/sevdesk)
[![TypeScript](https://img.shields.io/badge/TypeScript-2.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![node](https://img.shields.io/badge/node->=%206.x.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-7B1FA2.svg)](http://prettier.io/)

## Usage

Use TypeScript for best in class instellisense.

This package aims to be a fully typed (TypeScript), easy to use unofficial nodejs API package for sevdesk.com.

The basic concept of this library consists of classes that expose static functions (factories) for retrieving instances from the sevdesk API while abstracting enough to not needing to know the specifics of that API.

Typings and constructor options follow the world view of @tsclass/tsclass, a package that exposes generalized interfaces for real world objects.

**Available Classes**

- SevdeskAccount -> handles the basic Account setup for authentication
- SevdeskContact -> handles contacts within sevdesk
- SevdeskVoucher -> handles expenses/receipts/vouchers within sevdesk
- SevdeskCheckingAccount -> handles CheckingAccounts within sevdesk
- SevdeskTransaction -> handles Transactions within sevdesk

Every class exposes static functions to **retrieve information from sevdesk**.
Every instance of an class exposes a .save(myAccountInstanceHere) function to **store information back to sevdesk**.

```typescript
import * as sevdesk from '@mojoio/sevdesk';

const sevdeskAccount = new sevdesk.SevdeskAccount('myTokenString1234567890');
const contacts: sevdesk.SevdeskContact[] = sevdesk.SevdeskContact.getContacts(sevdeskAccount);
const certainContact = contacts.find(contact => {
  return contact.customerNumber === '1000';
});

certainContact.name = 'My New Name';

// note:
// If you want to transfer the contact to another account, simply instantiate a second account :)
certainContact.save(sevdeskAccount);
```

A simple example to create Transactions:

```typescript
import * as sevdesk from '@mojoio/sevdesk';

const run = async () => {
  const sevdeskAccount = new sevdesk.SevdeskAccount('');
  let sevdeskCheckingAccount = await sevdesk.SevdeskCheckingAccount.getCheckingAccountByName(
    sevdeskAccount,
    'commerzbank'
  );

  if(!sevdeskCheckingAccount) {
    sevdeskCheckingAccount = new sevdesk.SevdeskCheckingAccount({
      currency: 'EUR',
      name: 'commerzbank',
      transactions: []
    });
    sevdeskCheckingAccount.save(sevdeskAccount);
  }

  const myTransaction = new sevdesk.SevdeskTransaction({
    sevdeskCheckingAccountId: sevdeskCheckingAccount.sevdeskId,
    payeeName: 'Max Mustermann',
    amount: 100,
    date: new Date(),
    status: "unpaid",
    description: 'a cool description'
  })

  myTransaction.save(sevdeskAccount);
};

run();
```

For further information read the linked docs at the top of this README.

> MIT licensed | **&copy;** [Lossless GmbH](https://lossless.gmbh)
> | By using this npm module you agree to our [privacy policy](https://lossless.gmbH/privacy.html)

[![repo-footer](https://mojoio.gitlab.io/assets/repo-footer.svg)](https://mojo.io)
