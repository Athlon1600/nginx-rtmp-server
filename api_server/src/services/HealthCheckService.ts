import {Database} from "../Database";

export class HealthCheckService {

    static async checkOrFail(): Promise<void> {
        await Database.getInstance().ping();
    }
}