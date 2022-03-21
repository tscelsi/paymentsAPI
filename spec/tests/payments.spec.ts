import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import User, { IUser } from '@models/user-model';
import Payment, { IPayment } from "@models/payment-model";
import { pErr } from '@shared/functions';
import paymentRepo from '@repos/payment-repo';
import userRepo from "@repos/user-repo";

type TReqBody = string | object | undefined;


describe('payments-router', () => {

    const paymentsPath = '/api/payments';

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;
    let users: IUser[];
    let payments: IPayment[];

    // mock getOne function for user repo
    spyOn(userRepo, 'getOne').and.callFake((user_id) => {
        return Promise.resolve(users.filter((user) => {
            if (user.id === user_id) return true;
            else return false;
        })[0]);
    });


    beforeAll((done) => {
        agent = supertest.agent(app);
        users = [
            User.new('Sean Maxwell', 'sean.maxwell@gmail.com', 1000),
            User.new('John Smith', 'john.smith@gmail.com', 1000),
        ];
        let newPayment = Payment.getNew(users[0].id, 500, "first payment", users[1].id);
        newPayment.state = "successful"
        payments = [
            newPayment
        ]
        done();
    });


    /***********************************************************************************
     *                                    Test Get
     **********************************************************************************/

    describe(`"GET:/api/payments/"`, () => {

        it(`should return an empty list because no payments.`, (done) => {
            // Setup spy
            spyOn(paymentRepo, 'getAll').and.callFake((user_id) => {
                return Promise.resolve([])
            });
            // Call API
            agent.get("/api/payments/")
                .set("access_token", users[0].id)
                .expect(200)
                .end((err, res) => {
                    if (err) throw new Error;
                    else done();
                })
        });

        it(`should return the payments of the first user to the second.`, (done) => {
            // Setup spy
            const errMsg = 'Could not fetch users.';
            spyOn(paymentRepo, 'getAll').and.returnValue(Promise.resolve(payments.filter((payment) => {
                if (payment.user_id === users[0].id) return true;
                else return false;
            })));
            // Call API
            agent.get("/api/payments")
                .set("access_token", users[0].id)
                .expect(200)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    // expect(res.body[0])
                    expect(res.body[0].amount).toBe(500)
                    expect(res.body[0].description).toBe("first payment")
                    expect(res.body[0].user_id).toBe(users[0].id)
                    done();
                });
        });
    });

    /***********************************************************************************
     *                                    Test POST
     **********************************************************************************/

    // describe("POST: /api/payments/create", () => {
    // })
    // describe("POST: /api/payments/amend", () => {
    // })
});
