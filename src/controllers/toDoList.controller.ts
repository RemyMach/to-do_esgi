import {ModelCtor} from "sequelize";
import {UserInstance} from "../models/user.model";
import {SequelizeManager} from "../models";
import {ToDoListInstance} from "../models/toDoList.model";
import {ItemCreationProps, ItemInstance, ItemModel} from "../models/item.model";

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

    public async addToDoListToUser(user: UserInstance, todolist_name: string): Promise<ToDoListInstance | null>
    {
        const toDoListInstance = await this.toDoList.create({
            name: todolist_name
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
                    id: user_id
                }
            }
        });
    }

    public async getToDoListsByUserMail(user_mail: string): Promise<ToDoListInstance[] | null>
    {
        return await this.toDoList.findAll({
            attributes: ['id', 'name'],
            include: {
                model: this.user,
                required: true,
                where: {
                    email: user_mail
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

    public async getAndConvertItemInstancesToItemModels(toDoListId: number): Promise<ItemModel[] | null>
    {
        const itemInstances = await this.getToDoListItemsWithToDoListId(toDoListId);
        if(itemInstances === null){
            return null;
        }
        return itemInstances.map(function (itemInstance) {
            return new ItemModel(
                itemInstance.id,
                itemInstance.content,
                itemInstance.createdAt,
                itemInstance.name

            )
        })
    }

    public async getAllToDoLists(): Promise<ToDoListInstance[]> {
        return await this.toDoList.findAll();
    }
}
