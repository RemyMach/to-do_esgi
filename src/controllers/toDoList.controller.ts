import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";
import {ToDoListInstance} from "../models/toDoList.model";

export class ToDoListController
{
    toDoList: ModelCtor<ToDoListInstance>;
    user: ModelCtor<UserInstance>;

    private static instance: ToDoListController;

    public static async getInstance(): Promise<ToDoListController> {
        if (ToDoListController.instance === undefined) {
            const {toDoList, user} = await SequelizeManager.getInstance();
            ToDoListController.instance = new ToDoListController(toDoList, user);
        }
        return ToDoListController.instance;
    }

    private constructor(toDoList: ModelCtor<ToDoListInstance>, user: ModelCtor<UserInstance>) {
        this.toDoList = toDoList;
        this.user = user;
    }
}
