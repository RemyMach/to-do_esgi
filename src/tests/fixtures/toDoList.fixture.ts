import {fixture} from "./fixture";
import {SequelizeManager} from "../../models";
import {ToDoListInstance} from "../../models/toDoList.model";
import {UserFixture} from "./user.fixture";

export class ToDoListFixture implements fixture
{
    todo_list_for_user_remy?: ToDoListInstance;
    todo_list_for_user_jean?: ToDoListInstance;

    private static instance: ToDoListFixture;

    public static async getInstance(): Promise<ToDoListFixture> {
        if(ToDoListFixture.instance === undefined) {
            ToDoListFixture.instance = new ToDoListFixture();
        }
        return ToDoListFixture.instance;
    }

    private constructor() {};
    
    public async fillTable(): Promise<void> {
        const manager = await SequelizeManager.getInstance();
        const userFixture = await UserFixture.getInstance();

        this.todo_list_for_user_remy = await manager.toDoList.create({
            id: 1,
            name: "My todo list, don't touch it you son of your mom"
        });
        this.todo_list_for_user_remy.setUser(userFixture.user_remy);

        this.todo_list_for_user_jean = await manager.toDoList.create({
            id: 2,
            name: "How to cheat on exam"
        });
        this.todo_list_for_user_jean.setUser(userFixture.user_jean);
    }

    public async destroyFieldsTable(): Promise<void> {
        const manager = await SequelizeManager.getInstance();
        await manager.toDoList.sequelize?.query('SET FOREIGN_KEY_CHECKS = 0');
        await manager.toDoList.destroy({
            truncate: true,
            force: true
        });
    }
}
