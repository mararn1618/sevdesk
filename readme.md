# @mojoio/sevdesk

mojoio integration package for sevdesk

## Availabililty and Links

- [npmjs.org (npm package)](https://www.npmjs.com/package/@mojoio/sevdesk)
- [gitlab.com (source)](https://gitlab.com/mojoio/sevdesk)
- [github.com (source mirror)](https://github.com/mojoio/sevdesk)
- [docs (typedoc)](https://mojoio.gitlab.io/sevdesk/)

## Status for master

| Status Category                                 | Status Badge                                                                                                                                                                                                                                    |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitLab Pipelines                                | [![pipeline status](https://gitlab.com/mojoio/sevdesk/badges/master/pipeline.svg)](https://lossless.cloud)                                                                                                                                      |
| GitLab Pipline Test Coverage                    | [![coverage report](https://gitlab.com/mojoio/sevdesk/badges/master/coverage.svg)](https://lossless.cloud)                                                                                                                                      |
| npm                                             | [![npm downloads per month](https://badgen.net/npm/dy/@mojoio/sevdesk)](https://lossless.cloud)                                                                                                                                                 |
| Snyk                                            | [![Known Vulnerabilities](https://badgen.net/snyk/mojoio/sevdesk)](https://lossless.cloud)                                                                                                                                                      |
| TypeScript Support                              | [![TypeScript](https://badgen.net/badge/TypeScript/>=%203.x/blue?icon=typescript)](https://lossless.cloud)                                                                                                                                      |
| node Support                                    | [![node](https://img.shields.io/badge/node->=%2010.x.x-blue.svg)](https://nodejs.org/dist/latest-v10.x/docs/api/)                                                                                                                               |
| Code Style                                      | [![Code Style](https://badgen.net/badge/style/prettier/purple)](https://lossless.cloud)                                                                                                                                                         |
| PackagePhobia (total standalone install weight) | [![PackagePhobia](https://badgen.net/packagephobia/install/@mojoio/sevdesk)](https://lossless.cloud)                                                                                                                                            |
| PackagePhobia (package size on registry)        | [![PackagePhobia](https://badgen.net/packagephobia/publish/@mojoio/sevdesk)](https://lossless.cloud)                                                                                                                                            |
| BundlePhobia (total size when bundled)          | [![BundlePhobia](https://badgen.net/bundlephobia/minzip/@mojoio/sevdesk)](https://lossless.cloud)                                                                                                                                               |
| Platform support                                | [![Supports Windows 10](https://badgen.net/badge/supports%20Windows%2010/yes/green?icon=windows)](https://lossless.cloud) [![Supports Mac OS X](https://badgen.net/badge/supports%20Mac%20OS%20X/yes/green?icon=apple)](https://lossless.cloud) |

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

```typescript
import * as sevdesk from '@mojoio/sevdesk';

const run = async () => {
  const sevdeskAccount = new sevdesk.SevdeskAccount('myTokenString1234567890');
  const contacts: sevdesk.SevdeskContact[] = await sevdeskAccount.getContacts();
  const certainContact = contacts.find((contact) => {
    return contact.customerNumber === '1000';
  });

  // lets update the name of a contact
  certainContact.name = 'My New Name';
  await certainContact.save();
};
run();
```

A simple example to create Transactions:

```typescript
import * as sevdesk from '@mojoio/sevdesk';

const run = async () => {
  const sevdeskAccount = new sevdesk.SevdeskAccount('myTokenString1234567890');
  const sevdeskCheckingAccounts: sevdesk.SevdeskCheckingAccount[] = await sevdeskAccount.getCheckingAccounts();

  // lets create a new checking account
  await sevdeskAccount.createCheckingAccount({
    currency: 'EUR',
    name: 'commerzbank',
    transactions: [],
  });

  const myTransaction = new sevdesk.SevdeskTransaction({
    sevdeskCheckingAccountId: sevdeskCheckingAccount.sevdeskId,
    payeeName: 'Max Mustermann',
    amount: 100,
    date: new Date(),
    status: 'unpaid',
    description: 'a cool description',
  });

  await myTransaction.save(sevdeskAccount);
};

run();
```

## Contribution

We are always happy for code contributions. If you are not the code contributing type that is ok. Still, maintaining Open Source repositories takes considerable time and thought. If you like the quality of what we do and our modules are useful to you we would appreciate a little monthly contribution: You can [contribute one time](https://lossless.link/contribute-onetime) or [contribute monthly](https://lossless.link/contribute). :)

For further information read the linked docs at the top of this readme.

> MIT licensed | **&copy;** [Lossless GmbH](https://lossless.gmbh)
> | By using this npm module you agree to our [privacy policy](https://lossless.gmbH/privacy)

[![repo-footer](https://lossless.gitlab.io/publicrelations/repofooter.svg)](https://maintainedby.lossless.com)
