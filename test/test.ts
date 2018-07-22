import { expect, tap } from "@pushrocks/tapbundle";
import * as sevdesk from "../ts";

import * as qenv from "qenv";

const testQenv = new qenv.Qenv("./", "./.nogit");

let testSevdeskAccount: sevdesk.SevdeskAccount;
let sevDeskTestContact: sevdesk.SevdeskContact;

tap.test("should create a sevdeskAccount", async () => {
  testSevdeskAccount = new sevdesk.SevdeskAccount(process.env.SEVDESK_TOKEN);
  expect(testSevdeskAccount).to.be.instanceof(sevdesk.SevdeskAccount);
});

tap.test("should create contact with type person", async () => {
  sevDeskTestContact = new sevdesk.SevdeskContact({
    title: "Doctor",
    customerNumber: "1000",
    name: "Toni",
    surname: "Stark",
    type: "person",
    address: {
      streetName: "Stark Industries Loop",
      postalCode: "10000",
      city: "New York",
      country: "Germany",
      houseNumber: "6"
    },
    email: "tony@starkindustries.com",
    phone: "+1 646 822 4567",
    description: "Toni is an entrepreneur and a natural Person"
  });
  await sevDeskTestContact.save(testSevdeskAccount);
});

tap.test("should create contact with type company", async () => {
  sevDeskTestContact = new sevdesk.SevdeskContact({
    customerNumber: "1001",
    name: "Start Technologies",
    type: "company",
    address: {
      streetName: "Stark Industries Loop",
      postalCode: "10000",
      city: "New York",
      country: "Malta",
      houseNumber: "7"
    },
    email: "office@starkindustries.com",
    phone: "+1 646 822 4567",
    description: "Stark Technologies is a company"
  });
  await sevDeskTestContact.save(testSevdeskAccount);
});

tap.test("should create an expense with PDF file", async () => {
  const expense = new sevdesk.SevdeskExpense({
    accountRef: null,
    contactRef: null,
    expenseItems: [],
    voucherFile: "./test/testvoucher.pdf"
  });
  await expense.save(testSevdeskAccount);
});

tap.test("should create a valid checking account", async () => {
  const myCheckingAccount = new sevdesk.SevdeskCheckingAccount({
    name: "Commerzbank",
    currency: "eur",
    payments: []
  });
  await myCheckingAccount.save(testSevdeskAccount);
});

tap.test("should get transactions for an account", async () => {
  const myCheckingAccount = await sevdesk.SevdeskCheckingAccount.getCheckingAccountByName(
    testSevdeskAccount,
    "Commerzbank"
  );
  myCheckingAccount.getTransactions();
});

tap.start();
