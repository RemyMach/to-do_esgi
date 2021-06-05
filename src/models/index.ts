import {ModelCtor, Sequelize} from "sequelize";
import userCreator, {UserInstance} from "./user.model";
import sessionCreator, {SessionInstance} from "./session.model";
import itemCreator, {ItemInstance} from "./item.model";
import toDoListCreator, {ToDoListInstance} from "./toDoList.model";
import {Dialect} from "sequelize/types/lib/sequelize";


export interface SequelizeManagerProps {
    sequelize: Sequelize;
    user: ModelCtor<UserInstance>;
    session: ModelCtor<SessionInstance>;
    item: ModelCtor<ItemInstance>;
    toDoList: ModelCtor<ToDoListInstance>;
}

export class SequelizeManager implements SequelizeManagerProps {

    private static instance?: SequelizeManager

    sequelize: Sequelize;
    user: ModelCtor<UserInstance>;
    session: ModelCtor<SessionInstance>;
    item: ModelCtor<ItemInstance>;
    toDoList: ModelCtor<ToDoListInstance>;

    public static async getInstance(): Promise<SequelizeManager> {
        if(SequelizeManager.instance === undefined) {
            SequelizeManager.instance = await SequelizeManager.initialize();
        }
        return SequelizeManager.instance;
    }

    private static async initialize(): Promise<SequelizeManager> {
        const sequelize = new Sequelize({
            dialect: process.env.DB_DRIVER as Dialect,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: Number.parseInt(process.env.DB_PORT as string),
            logging: false
        });
        await sequelize.authenticate();
        const managerProps: SequelizeManagerProps = {
            sequelize,
            user: userCreator(sequelize),
            session: sessionCreator(sequelize),
            item: itemCreator(sequelize),
            toDoList: toDoListCreator(sequelize)
        }

        SequelizeManager.associate(managerProps);
        await sequelize.sync({force: true});
        return new SequelizeManager(managerProps);
    }

    private static associate(props: SequelizeManagerProps): void {

        props.user.hasMany(props.session); // User N Session
        props.session.belongsTo(props.user, {foreignKey: 'user_id'}); // Session 1 User

        props.user.hasMany(props.toDoList);
        props.toDoList.belongsTo(props.user, {foreignKey: 'user_id'});

        props.toDoList.hasMany(props.item);
        props.item.belongsTo(props.toDoList, {foreignKey: 'to_do_list_id'});
    }

    private constructor(props: SequelizeManagerProps) {
        this.sequelize = props.sequelize;
        this.user = props.user;
        this.session = props.session;
        this.item = props.item;
        this.toDoList = props.toDoList;
    }
}
