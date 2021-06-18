import {ModelCtor} from "sequelize";
import {ItemInstance} from "../models/item.model";
import {ToDoListController} from "./toDoList.controller";
import {SequelizeManager} from "../models";

export class ItemController {

    item: ModelCtor<ItemInstance>;

    private static instance: ItemController;

    public static async getInstance(): Promise<ItemController> {
        if (ItemController.instance === undefined) {
            const {item} = await SequelizeManager.getInstance();
            ItemController.instance = new ItemController(item);
        }
        return ItemController.instance;
    }

    private constructor(item: ModelCtor<ItemInstance>) {
        this.item = item;
    }

    public async getItemById(id: number): Promise<ItemInstance | null> {

        return  await this.item.findOne({
            attributes: ['id', 'name', 'content','createdAt',],
            where: {
                id
            }
        });
    }

    public async getAllItems(): Promise<ItemInstance[]> {
        return await this.item.findAll();
    }

    public async createItem(toDoListId: number, name: string, content: string, createdAt: Date): Promise<ItemInstance | null> {
        let toDoListController = await ToDoListController.getInstance();
        let toDoList = await toDoListController.getToDoListById(toDoListId);
        if (toDoList == null) {
            return null;
        }

        let item = await this.item.create({
            name,
            content,
            createdAt
        });

        item.setToDoList(toDoList);

        return item;
    }

    public async deleteItem(id: number): Promise<boolean> {
        await this.item.destroy({
            where: {
                id
            }
        });

        let item = await this.getItemById(id);

        return item == null;
    }

    public async countItems(): Promise<number> {
        return await this.item.count();
    }
}
