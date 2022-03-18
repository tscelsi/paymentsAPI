import { IUser } from '@models/user-model';
import { getRandomInt } from '@shared/functions';
import { v4 } from 'uuid';
import orm from './mock-orm';



/**
 * Get one user.
 * 
 * @param email 
 * @returns 
 */
async function getOne(user_id: string): Promise<IUser | null> {
    const db = await orm.openDb();
    for (const user of db.users) {
        if (user.id === user_id) {
            return user;
        }
    }
    return null;
}


/**
 * See if a user with the given id exists.
 * 
 * @param id 
 */
async function persists(id: string): Promise<boolean> {
    const db = await orm.openDb();
    for (const user of db.users) {
        if (user.id === id) {
            return true;
        }
    }
    return false;
}


/**
 * Get all users.
 * 
 * @returns 
 */
async function getAll(): Promise<IUser[]> {
    const db = await orm.openDb();
    return db.users;
}


/**
 * Add one user.
 * 
 * @param user 
 * @returns 
 */
async function add(user: IUser): Promise<void> {
    const db = await orm.openDb();
    user.id = v4();
    db.users.push(user);
    return orm.saveDb(db);
}


/**
 * Update a user.
 * 
 * @param user 
 * @returns 
 */
async function update(user: IUser): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === user.id) {
            db.users[i] = user;
            return orm.saveDb(db);
        }
    }
}


/**
 * Delete one user.
 * 
 * @param id 
 * @returns 
 */
async function deleteOne(id: number): Promise<void> {
    const db = await orm.openDb();
    for (let i = 0; i < db.users.length; i++) {
        if (db.users[i].id === id) {
            db.users.splice(i, 1);
            return orm.saveDb(db);
        }
    }
}


// Export default
export default {
    getOne,
    persists,
    getAll,
    add,
    update,
    delete: deleteOne,
} as const;
