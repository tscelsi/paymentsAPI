import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import userRepo from '@repos/user-repo';
import User, { IUser } from '@models/user-model';
import { pErr } from '@shared/functions';
import { ParamMissingError, UserNotFoundError } from '@shared/errors';
import paymentRepo from '@repos/payment-repo';

type TReqBody = string | object | undefined;


describe('payments-router', () => {

    const paymentsPath = '/api/payments';

    const { BAD_REQUEST, CREATED, OK } = StatusCodes;
    let agent: SuperTest<Test>;
    let users: IUser[];
    beforeAll((done) => {
        agent = supertest.agent(app);
        users = [
            User.new('Sean Maxwell', 'sean.maxwell@gmail.com', 1000),
            User.new('John Smith', 'john.smith@gmail.com', 1000),
        ];
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
            agent.post("/api/payments/")
                .set("access_token", users[0].id)
                .expect(200)
                .end((err, res) => {
                    console.log(res);
                })
        });

        // it(`should return a JSON object containing an error message and a status code of
        //     "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
        //     // Setup spy
        //     const errMsg = 'Could not fetch users.';
        //     spyOn(userRepo, 'getAll').and.throwError(errMsg);
        //     // Call API
        //     agent.get(createPaymentPath)
        //         .end((err: Error, res: Response) => {
        //             pErr(err);
        //             console.log(res.body)
        //             expect(res.status).toBe(BAD_REQUEST);
        //             expect(res.body.error).toBe(errMsg);
        //             done();
        //         });
        // });
    });


//     /***********************************************************************************
//      *                                    Test Post
//      **********************************************************************************/

//     describe(`"POST:${createPaymentPath}"`, () => {
//         const callApi = (reqBody: TReqBody) => {
//             return agent.post(createPaymentPath).type('form').send(reqBody);
//         };
        

//     })

//     describe(`"POST:${createPaymentPath}"`, () => {

//         const callApi = (reqBody: TReqBody) => {
//             return agent.post(createPaymentPath).type('form').send(reqBody);
//         };

//         it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
//             const users = [
//                 User.new('Sean Maxwell', 'sean.maxwell@gmail.com', 1000),
//                 User.new('John Smith', 'john.smith@gmail.com', 1000),
//             ];
//             // Setup Spy
//             spyOn(userRepo, 'getOne').and.callFake((user_id) => {
//                 const user = users.filter((user) => {
//                     if (user.id === user_id) return true;
//                     else return false;
//                 })[0];
//                 return Promise.resolve(user);
//             });

//             spyOn(userRepo, 'persists').and.callFake((id) => {
//                 for (const user of users) {
//                     if (user.id === id) return Promise.resolve(true);
//                 }
//                 return Promise.resolve(false);
//             });

//             // Call API
//             agent.post(createPaymentPath)
//                 .send({
//                     description: "This is a test payment",
//                     amount: 30,
//                     receiving_user_id: users[1].id
//                 })
//                 .set("access_token", users[0].id)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(CREATED);
//                     expect(res.body.error).toBeUndefined();
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a status
//             code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
//             // Call API
//             callApi({})
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(ParamMissingError.Msg);
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
//             if the request was unsuccessful.`, (done) => {
//             // Setup spy
//             const errMsg = 'Could not add user.';
//             spyOn(userRepo, 'add').and.throwError(errMsg);
//             // Call API
//             callApi(userData)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(errMsg);
//                     done();
//                 });
//         });
//     });


//     /***********************************************************************************
//      *                                    Test Put
//      **********************************************************************************/

//     // describe(`"PUT:${updateUserPath}"`, () => {

//     //     const callApi = (reqBody: TReqBody) => {
//     //         return agent.put(updateUserPath).type('form').send(reqBody);
//     //     };
//     //     const userData = {
//     //         user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
//     //     };

//     //     it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
//     //         // Setup spy
//     //         spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//     //         spyOn(userRepo, 'update').and.returnValue(Promise.resolve());
//     //         // Call Api
//     //         callApi(userData)
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(OK);
//     //                 expect(res.body.error).toBeUndefined();
//     //                 done();
//     //             });
//     //     });

//     //     it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a
//     //         status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
//     //         // Call api
//     //         callApi({})
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(BAD_REQUEST);
//     //                 expect(res.body.error).toBe(ParamMissingError.Msg);
//     //                 done();
//     //             });
//     //     });

//     //     it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
//     //         and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
//     //         // Call api
//     //         callApi(userData)
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(UserNotFoundError.HttpStatus);
//     //                 expect(res.body.error).toBe(UserNotFoundError.Msg);
//     //                 done();
//     //             });
//     //     });

//     //     it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
//     //         if the request was unsuccessful.`, (done) => {
//     //         spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//     //         // Setup spy
//     //         const updateErrMsg = 'Could not update user.';
//     //         spyOn(userRepo, 'update').and.throwError(updateErrMsg);
//     //         // Call API
//     //         callApi(userData)
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(BAD_REQUEST);
//     //                 expect(res.body.error).toBe(updateErrMsg);
//     //                 done();
//     //             });
//     //     });
//     });


//     /***********************************************************************************
//      *                                    Test Delete
//      **********************************************************************************/

//     // describe(`"DELETE:${deleteUserPath}"`, () => {

//     //     const callApi = (id: number) => {
//     //         return agent.delete(deleteUserPath.replace(':id', id.toString()));
//     //     };

//     //     it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
//     //         // Setup spy
//     //         spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//     //         spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
//     //         // Call api
//     //         callApi(5)
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(OK);
//     //                 expect(res.body.error).toBeUndefined();
//     //                 done();
//     //             });
//     //     });

//     //     it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
//     //         and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
//     //         // Call api
//     //         callApi(-1)
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(StatusCodes.NOT_FOUND);
//     //                 expect(res.body.error).toBe(UserNotFoundError.Msg);
//     //                 done();
//     //             });
//     //     });

//     //     it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
//     //         if the request was unsuccessful.`, (done) => {
//     //         spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//     //         // Setup spy
//     //         const deleteErrMsg = 'Could not delete user.';
//     //         spyOn(userRepo, 'delete').and.throwError(deleteErrMsg);
//     //         // Call Api
//     //         callApi(1)
//     //             .end((err: Error, res: Response) => {
//     //                 pErr(err);
//     //                 expect(res.status).toBe(BAD_REQUEST);
//     //                 expect(res.body.error).toBe(deleteErrMsg);
//     //                 done();
//     //             });
//     //     });
//     // });
});
