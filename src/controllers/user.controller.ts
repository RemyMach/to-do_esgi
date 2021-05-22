import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";

export class UserController {

    user: ModelCtor<UserInstance>;
    session: ModelCtor<SessionInstance>;

    private static instance: UserController;

    public static async getInstance(): Promise<UserController> {
        if (UserController.instance === undefined) {
            const {user, session} = await SequelizeManager.getInstance();
            UserController.instance = new UserController(user, session);
        }
        return UserController.instance;
    }

    private constructor(user: ModelCtor<UserInstance>, session: ModelCtor<SessionInstance>) {
        this.user = user;
        this.session = session;
    }

    public async getUserByEmail(email: string): Promise<UserInstance | null> {

        return  await this.user.findOne({
            attributes: ['email', 'firstName', 'lastName','birthDate',],
            where: {
                email
            }
        });
    }
}
