import {Database} from "../Database";
import {UserSchema} from "../types";
import {validateUsername} from "../validators";
import {passwordVerify} from "../util/password";

export class UserService {

    static async findByCredentials(username: string, password: string): Promise<UserSchema> {

        const existing = await Database.getInstance().findByUsername(username);

        if (existing && existing.password && password) {
            const isPasswordCorrect = await passwordVerify(password, existing.password);

            if (isPasswordCorrect) {
                return Database.getInstance().findById(existing.id);
            }
        }

        return null;
    }

    static async createUserWithPassword(username: string, password: string): Promise<UserSchema> {

        if (!validateUsername(username)) {
            throw new Error('Invalid username');
        }

        const existingUser = await Database.getInstance().findByUsername(username);

        if (existingUser) {
            throw "User with such username already exists!";
        }

        return Database.getInstance().createUserWithPassword(username, password);
    }
}