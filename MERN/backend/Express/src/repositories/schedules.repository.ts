import { schedules, schedulesAttributes } from "../models/init-models";
import console_log from "../../../functions/logging/console_log";

interface ISchedulesRepository {
    find(args: any): Promise<Partial<schedulesAttributes>[] | undefined>;
    select(args: any): Promise<Partial<schedulesAttributes> | undefined>;
}

class SchedulesRepository implements ISchedulesRepository {
    async find(args: any) {
        const response: Partial<schedulesAttributes>[] | undefined = await schedules
            .findAll(args)
            .then((result) => {
                let results: schedulesAttributes[] = [];
                result.forEach((s) => { results.push(s.dataValues); });
                return results;
            })
            .catch((e) => {
                console_log("Error: ", e.message, "\n\n");
                return undefined;
            });
        console_log(response);
        return response;
    }

    async select(args: any) {
        const response: Partial<schedulesAttributes> | undefined = await schedules
            .findOne(args)
            .then((result) => { return result.dataValues; })
            .catch((e) => {
                console_log("Error: ", e.message, "\n\n");
                return undefined;
            });
        console_log(response);
        return response;
    }
}

export default new SchedulesRepository();