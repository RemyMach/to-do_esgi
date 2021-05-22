import {ModelCtor} from "sequelize";
import {ItemInstance, ItemCreationProps} from "../models/item.model";
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

    public async createItem(name: string, content: string, createdAt: Date): Promise<ItemInstance | null> {
        return await this.item.create({
            name,
            content,
            createdAt
        });
    }
}
