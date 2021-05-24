import {SequelizeManager} from "../../models";
import {UserInstance} from "../../models/user.model";
import {fixture} from "./fixture";
import {ToDoListFixture} from "./toDoList.fixture";


export class UserFixture implements fixture{

    user_remy?: UserInstance;
    user_jean?: UserInstance;
    user_pam?: UserInstance;
    user_rachel?: UserInstance;
    user_margot?: UserInstance;
    user_leonard?: UserInstance;

    private static instance: UserFixture;

    public static async getInstance(): Promise<UserFixture> {
        if(UserFixture.instance === undefined) {
            UserFixture.instance = new UserFixture();
        }
        return UserFixture.instance;
    }

    private constructor() {};

    public async fillTable(): Promise<void> {

        const manager = await SequelizeManager.getInstance();
        const toDoListFixture = await ToDoListFixture.getInstance();
        const birthDateValid = new Date();
        birthDateValid.setUTCFullYear(new Date().getUTCFullYear() -13);

        this.user_remy = await manager.user.create({
            firstName: "remy",
            lastName: "Mac",
            email: 'jean@pomme.fr',
            password: "azertyuiop",
            birthDate: birthDateValid
        });
        this.user_remy.setToDoList(toDoListFixture.todo_list_for_user_remy);

        this.user_jean = await manager.user.create({
            firstName: "jean",
            lastName: "duc",
            email: 'kim@pomme.fr',
            password: "azertyuiop",
            birthDate: birthDateValid
        });

        this.user_pam = await manager.user.create({
            firstName: "pam",
            lastName: "vanger",
            email: 'leonard@vanger.com',
            password: "azertyuiop",
            birthDate: birthDateValid
        });

        this.user_margot = await manager.user.create({
            firstName: "amrgot",
            lastName: "Quesner",
            email: 'miroulf@quesner.com',
            password: "azertyuiop",
            birthDate: birthDateValid
        });

        this.user_rachel = await manager.user.create({
            firstName: "rachel",
            lastName: "touner",
            email: 'timoulf@touner.fr',
            password: "azertyuiop",
            birthDate: birthDateValid
        });

        this.user_leonard = await manager.user.create({
            firstName: "leonard",
            lastName: "tomir",
            email: 'timarou@tomir.fr',
            password: "azertyuiop",
            birthDate: birthDateValid
        });
    }

    public async destroyFieldsTable(): Promise<void> {
        const manager = await SequelizeManager.getInstance();
        await manager.user.sequelize?.query('SET FOREIGN_KEY_CHECKS = 0');
        await manager.user.destroy({
            truncate: true,
            force: true
        });
    }
}
