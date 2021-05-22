import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare} from "bcrypt";
import {Secret, sign} from "jsonwebtoken";

export class SessionController {

    user: ModelCtor<UserInstance>;
    session: ModelCtor<SessionInstance>;

    private static instance: SessionController;

    public static async getInstance(): Promise<SessionController> {
        if (SessionController.instance === undefined) {
            const {user, session} = await SequelizeManager.getInstance();
            SessionController.instance = new SessionController(user, session);
        }
        return SessionController.instance;
    }

    private constructor(user: ModelCtor<UserInstance>, session: ModelCtor<SessionInstance>) {
        this.user = user;
        this.session = session;
    }

    public async getAllSessions(): Promise<SessionInstance[]> {
        return await this.session.findAll();
    }
}
