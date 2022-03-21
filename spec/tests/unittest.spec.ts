import { isValidPayDate, isScheduledPayment } from "@shared/validation";
import { getNextBusinessDate } from "@shared/functions";
type TReqBody = string | object | undefined;


describe('unittests', () => {

    /***********************************************************************************
     *                                    Unittests
     **********************************************************************************/

    describe("Validate date format", () => {
        it("should pass the date validation test", (done) => {
            const dateFormatString = "2022-11-02"; // 2nd November, 2022
            const result = isValidPayDate(dateFormatString)
            expect(result).toBe(true);
            done();
        });

        it("should fail the date validation test because it is a past date", (done) => {
            const dateFormatString = "2021-11-02"; // 2nd November, 2021
            const result = isValidPayDate(dateFormatString)
            expect(result).toBe(false);
            done();
        });

        it("should fail the date validation test because it is an invalid format", (done) => {
            const dateFormatString = "Jan132022"; // wrong format
            const result = isValidPayDate(dateFormatString);
            expect(result).toBe(false);
            done();
        });
    });

    describe("Validate correct next business day", () => {
        it("should return the following Monday", (done) => {
            const date = new Date("2022-03-20");
            const result = getNextBusinessDate(date);
            expect(result.getDate()).toBe(21)
            expect(result.getDay()).toBe(1)
            done();
        })
    })

    describe("Validate correct scheduled payment identification", () => {
        it("should be identified as a scheduled payment", (done) => {
            const scheduled_date = new Date("2022-12-12"); // 12th Descember, 2022
            const result = isScheduledPayment(scheduled_date);
            expect(result).toBe(true);
            done();
        });

        it("should NOT be identified as a scheduled payment", (done) => {
            const nextBusinessDate = getNextBusinessDate(new Date());
            const scheduled_date = new Date(nextBusinessDate.getTime()); // 12th Descember, 2022
            const result = isScheduledPayment(scheduled_date);
            expect(result).toBe(false);
            done();
        });
    })
});
