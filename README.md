*Welcome to PaymentsAPI!*, a simple API that allows users to make and schedule payments as well as view their balance implemented using Node.js and the Express framework. The skeleton for this project was generated using [express-generator-typescript](https://www.npmjs.com/package/express-generator-typescript).

- [Installation](#installation)
- [Running the API](#running-the-api)
- [Testing](#testing)
- [Docs](#docs)
  - [Payment States](#payment-states)
    - [Pending](#pending)
    - [Incomplete](#incomplete)
    - [Successful](#successful)
  - [API Reference](#api-reference)
    - [**/payment**](#payment)
      - [**/payment/get**](#paymentget)
      - [**/payment/pay**](#paymentpay)
      - [**/payment/schedule**](#paymentschedule)
    - [**/customer**](#customer)
      - [**/customer/balance**](#customerbalance)
- [Contact](#contact)

# Installation

This project was built using:

Package | Version
:-- | :--
Node | 16.13.1
Express | 4.17.3

# Running the API
# Testing
# Docs
## Payment States

A payment object can exist in multiple states depending on whether it is a valid payment or pending completion. We outline the payment states below.

### Pending

A `pending` payment is one that has been created, but not finalised in either the [Incomplete](#incomplete) state, or the [Successful](#finalised) state.

### Incomplete

An `Incomplete` payment is one that has been created and deemed invalid due to any of the following reasons:
1. Invalid user authentication token.
2. The receiving user of a payment doesn't exist.
3. A payment description hasn't been provided.
4. Funds to complete a payment aren't available in the users account.
5. A negative payment has been submitted.


### Successful

A `Successful` payment exists when none of the conditions that would make a payment `Incomplete` occur and the payment transaction has completed.

## API Reference
### **/payment**
The payment endpoint takes care of either paying upfront using `/pay` or scheduling a future payment using `/schedule`.

#### **/payment/get**

This endpoint retrieves a particular payment object that has previously been created by a user. A payment object created by a user should not be able to be retrieved by a different user.

`REQUEST:`

    {
        payment_id (required): A string of characters that uniquely identifies a payment
    }

`RESPONSE:`

    {
        user_id: string, // the unique user identifier
        amount: number, // the monetary amount payed
        description: string, // description of the payment
        created_at: string, // a string representation of the time the payment was created
        receiving_user_id: string, // unique user id of user receiving payment
        state: pending | incomplete | successful // the state of the returned payment object.
    }

#### **/payment/pay**
This endpoint creates and finalises a payment between two particular users. In order for a payment to be finalised:

The payload fields that can be submitted to the `/pay` endpoint are:
    
    {
        paying_user_id: A unique identifier of the paying user,
        amount: The monetary amount that should be payed,
        description: A description of what the payment is for,
        receiving_user_id: A unique identifier of the user receiving the payment (this equates to the beneficiary name)
    }

#### **/payment/schedule**
### **/customer**
#### **/customer/balance**
# Contact