import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";
import {ToDoListCreationProps, ToDoListInstance} from "../models/toDoList.model";
import {ItemCreationProps, ItemInstance} from "../models/item.model";

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

    public async addToDoListToUser(user: UserInstance, todolist: ToDoListCreationProps): Promise<ToDoListInstance | null>
    {
        const toDoListInstance = await this.toDoList.create({
            ...todolist
        });
        toDoListInstance.setUser(user);
        return toDoListInstance;
    }

    public async addItemToToDoList(toDoList: ToDoListInstance, item: ItemCreationProps): Promise<ItemInstance | null>
    {
        const itemInstance = await this.item.create({
            ...item
        });
        itemInstance.setToDoList(toDoList);
        return itemInstance;
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
