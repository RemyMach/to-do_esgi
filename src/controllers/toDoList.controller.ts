import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";
import {ToDoListInstance} from "../models/toDoList.model";
import {ItemInstance} from "../models/item.model";

export class ToDoListController
{
    toDoList: ModelCtor<ToDoListInstance>;
    user: ModelCtor<UserInstance>;
    item: ModelCtor<ItemInstance>;

    private static instance: ToDoListController;

    public static async getInstance(): Promise<ToDoListController> {
        if (ToDoListController.instance === undefined) {
            const {toDoList, user, item} = await SequelizeManager.getInstance();
            ToDoListController.instance = new ToDoListController(toDoList, user, item);
        }
        return ToDoListController.instance;
    }

    private constructor(toDoList: ModelCtor<ToDoListInstance>, user: ModelCtor<UserInstance>, item: ModelCtor<ItemInstance>) {
        this.toDoList = toDoList;
        this.user = user;
        this.item = item;
    }

    public async getToDoListById(id: number): Promise<ToDoListInstance | null>
    {
        return await this.toDoList.findOne({
            attributes: ['id', 'name'],
            where: {
                id
            }
        });
    }

    public async getToDoListsByUserId(user_id: number): Promise<ToDoListInstance[] | null>
    {
        return await this.toDoList.findAll({
            attributes: ['id', 'name'],
            include: {
                model: this.user,
                required: true,
                where: {
                    user: user_id
                }
            }
        });
    }

    public async getToDoListItemsWithToDoListId(id: number): Promise<ItemInstance[] | null>
    {
        return await this.item.findAll({
            attributes: ['id', 'name', 'content'],
            include: {
                model: this.toDoList,
                required: true,
                where: {
                    user: id
                }
            }
        });
    }
}
