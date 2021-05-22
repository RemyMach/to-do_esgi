import {ModelCtor} from "sequelize";
import {UserCreationProps, UserInstance} from "../models/user.model";
import {SessionInstance} from "../models/session.model";
import {SequelizeManager} from "../models";
import {compare} from "bcrypt";
import {Secret, sign} from "jsonwebtoken";

export class AuthController {

    user: ModelCtor<UserInstance>;
    session: ModelCtor<SessionInstance>;

    private static instance: AuthController;

    public static async getInstance(): Promise<AuthController> {
        if (AuthController.instance === undefined) {
            const {user, session} = await SequelizeManager.getInstance();
            AuthController.instance = new AuthController(user, session);
        }
        return AuthController.instance;
    }

    private constructor(user: ModelCtor<UserInstance>, session: ModelCtor<SessionInstance>) {
        this.user = user;
        this.session = session;
    }

    public async subscribe(props: UserCreationProps): Promise<UserInstance> {

        return await this.user.create({
            ...props
        });
    }

    public async log(email: string, password: string): Promise<SessionInstance | null> {

        const user = await this.user.findOne({
            where: {
                email: email
            }
        });

        if(user === null) {
            return null;
        }
        const isSamePassword = await compare(password, user.password);
        if(!isSamePassword) {
            return null;
        }
        const token = sign({ id: user.id.toString()}, process.env.JWT_SECRET as Secret);
        const session = await this.session.create({
            token
        });

        await session.setUser(user);
        return session;
    }

    public async getSession(token: string): Promise<SessionInstance | null> {
        try{
            return await this.session.findOne({
                where: {
                    token
                }
            });
        }catch(e) {
            return null;
        }
    }


}
