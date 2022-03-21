*Welcome to PaymentsAPI!*, a simple API that allows users to make and schedule payments as well as view their balance. It has been implemented using Node.js and the Express framework. The skeleton for this project was generated using [express-generator-typescript](https://www.npmjs.com/package/express-generator-typescript).

- [Installation](#installation)
- [Running the API](#running-the-api)
- [Testing](#testing)
- [Docs](#docs)
  - [Payment States](#payment-states)
    - [Pending](#pending)
    - [Incomplete](#incomplete)
    - [Successful](#successful)
  - [User Authentication](#user-authentication)
  - [API Reference](#api-reference)
    - [**GET /payments**](#get-payments)
      - [GET /payments/:payment_id](#get-paymentspayment_id)
      - [POST /payments/:payment_id/amend](#post-paymentspayment_idamend)
      - [POST /payments/create](#post-paymentscreate)
    - [**/customer**](#customer)
      - [/customer/balance](#customerbalance)

# Installation

This project was built using:

Package | Version
:-- | :--
Node | 16.13.1
Express | 4.17.3

# Running the API

The server was created to only be run in development mode:

    npm run start:dev

# Testing

The test suite was created using supertest (an API testing framework) and jasmine. The tests can be run using the command:
    
    npm run test

# Docs
## Payment States

A payment object can exist in multiple states depending on whether it is a valid payment or pending completion. We outline the payment states below.

### Pending

A `pending` payment is one that has been created, but not finalised in either the [Incomplete](#incomplete) state, or the [Successful](#finalised) state. For example, this occurs when scheduling payments in advance.

### Incomplete

An `Incomplete` payment is one that has been created and deemed invalid due to any of the following reasons:
1. Invalid user authentication token.
2. The receiving user of a payment doesn't exist.
3. A payment description hasn't been provided.
4. Funds to complete a payment aren't available in the users account.
5. A negative payment has been submitted.


### Successful

A `Successful` payment exists when none of the conditions that would make a payment `Incomplete` occur and the payment transaction has completed.

## User Authentication

In this project 'authentication' simply means passing a valid `access_token` in each requests headers. The `access_token` represents the user ID of an existing user in the database. If, for example, an `access_token` was passed that contained an invalid user ID, then any API request returns with the 401 Unauthorised HTTP status code. This `access_token` is also used to create, retrieve and update payments that are linked to a particular user.

## API Reference

### **GET /payments**

The `/payments` endpoint itself returns a list of all the payments created by the user that is authenticated to use the API.

`TYPE:` **GET**

`RESPONSE:` 
    
    [
      {
        payment_id: string,   // the unique payment identifier
        user_id: string,  // the unique user identifier
        amount: number,   // the monetary amount payed
        description: string,  // description of the payment
        created_at: string,   // a string representation of the time the payment was created
        receiving_user_id: string,  // unique user id of user receiving payment
        state: pending | incomplete | successful // the state of the returned payment object.
      },
      ...
    ]

#### GET /payments/:payment_id

This endpoint retrieves a particular payment object that has previously been created by a user. A payment object created by a user should not be able to be retrieved by a different user.

`TYPE:` **GET**

`PARAMS:`
        *payment_id* (required): A string of characters that uniquely identifies a payment

`RESPONSE:`
The payment object is returned:

    {
        payment_id: string,   // the unique payment identifier
        user_id: string,  // the unique user identifier
        amount: number,   // the monetary amount payed
        description: string,  // description of the payment
        created_at: string,   // a string representation of the time the payment was created
        receiving_user_id: string,  // unique user id of user receiving payment
        state: pending | incomplete | successful // the state of the returned payment object.
    }

#### POST /payments/:payment_id/amend

This endpoint allows the update of a payment object that is either in the `pending` or `incomplete` state. If an `incomplete` payment is updated, the transaction will be re-tried. For an amendment to be made, one of `amount`, `description` or `receiving_user_id` must be provided.

`TYPE:` **POST**

`PARAMS:`
        *payment_id* (required): A string of characters that uniquely identifies a payment

`REQUEST:`

    {
      amount (optional): number,  // the monetary amount payed
      description (optional): string,   // description of the payment
      receiving_user_id (optional): string  // the unique id of the user receiving the payment
    }  

`RESPONSE:`

The updated payment object is returned:

    {
      payment_id: string,   // the unique payment identifier
      user_id: string,  // the unique user identifier
      amount: number,   // the monetary amount payed
      description: string,  // description of the payment
      created_at: string,   // a string representation of the time the payment was created
      receiving_user_id: string,  // unique user id of user receiving payment
      state: pending | incomplete | successful  // the state of the returned payment object.
    }


#### POST /payments/create
This endpoint creates a new payment object.

The payload fields that can be submitted to the `/pay` endpoint are:

`TYPE:` **POST**

`REQUEST:`
    
    {
        amount (required): The monetary amount that should be payed,
        description (required): A description of what the payment is for,
        receiving_user_id (required): A unique identifier of the user receiving the payment (this equates to the beneficiary name),
        pay_date (optional): A date on which to transact the payment amount. Must be of form YYYY-MM-DD.
    }

`RESPONSE:`

If successful, this endpoint returns the newly created payment object.

    {
      payment_id: string,   // the unique payment identifier
      user_id: string,  // the unique user identifier
      amount: number,   // the monetary amount payed
      description: string,  // description of the payment
      created_at: string,   // a string representation of the time the payment was created
      receiving_user_id: string,  // unique user id of user receiving payment
      state: pending | incomplete | successful  // the state of the returned payment object.
    }
### **/customer**
#### /customer/balance

`TYPE:` **GET**

`RESPONSE:`
If successfully authenticated, this endpoint returns the name and balance for the authenticated account.

    {
      name: string,   // name associated with account
      balance: number   // balance of the account
    }