import logger from 'jet-logger';


/**
 * Print an error object if it's truthy. Useful for testing.
 * 
 * @param err 
 */
export function pErr(err?: Error): void {
    if (!!err) {
        logger.err(err);
    }
};


/**
 * Get a random number between 1 and 1,000,000,000,000
 * 
 * @returns 
 */
export function getRandomInt(): number {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export function getNextBusinessDate(date: Date): Date {
    let next = new Date(date.getTime());
    next.setDate(next.getDate()+1);
    while (next.getDay() == 6 || next.getDay() == 0) next.setDate(next.getDate() + 1);
    setTimeZero(next);
    return next;
}

export const setTimeZero = (date: Date): Date => {
    date.setUTCHours(0);
    date.setUTCMinutes(0);
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
}