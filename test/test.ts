import { expect, tap } from "tapbundle";
import * as sevdesk from "../ts/index";

import * as qenv from "qenv";

const testQenv = new qenv.Qenv("./", "./.nogit");

let sevDeskAccount: sevdesk.SevdeskAccount;
let sevDeskContact: sevdesk.Contact;

tap.test("should create a sevdeskAccount", async () => {
  sevDeskAccount = new sevdesk.SevdeskAccount(process.env.SEVDESK_TOKEN);
  expect(sevDeskAccount).to.be.instanceof(sevdesk.SevdeskAccount);
});

tap.test("should create contact with type person", async () => {
  sevDeskContact = new sevdesk.Contact({
    title: "Doctor",
    customerNumber: "1000",
    name: "Toni",
    surname: "Stark",
    type: "person",
    address: {
      streetName: "Stark Industries Loop",
      postalCode: "10000",
      city: "New York",
      country: "USA",
      houseNumber: "6"
    },
    description: "Toni is an entrepreneur and a natural Person"
  });
  await sevDeskContact.save(sevDeskAccount);
});

tap.test("should create contact with type company", async () => {
  sevDeskContact = new sevdesk.Contact({
    customerNumber: "1001",
    name: "Start Technologies",
    type: "company",
    address: {
      streetName: "Stark Industries Loop",
      postalCode: "10000",
      city: "New York",
      country: "USA",
      houseNumber: "7"
    },
    description: "Stark Technologies is a company"
  });
  await sevDeskContact.save(sevDeskAccount);
});

tap.start();
