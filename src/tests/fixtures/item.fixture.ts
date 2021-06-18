import {SequelizeManager} from "../../models";
import {ItemInstance} from "../../models/item.model";
import {fixture} from "./fixture";
import {ToDoListFixture} from "./toDoList.fixture";

export class ItemFixture implements fixture{

    item_1?: ItemInstance;
    item_2?: ItemInstance;
    item_3?: ItemInstance;

    private static instance: ItemFixture;

    public static async getInstance(): Promise<ItemFixture> {
        if(ItemFixture.instance === undefined) {
            ItemFixture.instance = new ItemFixture();
        }
        return ItemFixture.instance;
    }

    private constructor() {};

    public async fillTable(): Promise<void> {

        const manager = await SequelizeManager.getInstance();
        const toDoListFixture = await ToDoListFixture.getInstance();

        this.item_1 = await manager.item.create({
            name: "Windows c'est mieux que Mac",
            content: "Windows c'est mieux que Mac car sur Windows tu peux installer WSL et avoir Windows+Linux alors que sur Mac tu peux pas",
            createdAt: new Date(Date.now() - 3600)
        });
        this.item_1.setToDoList(toDoListFixture.todo_list_for_user_remy);

        this.item_2 = await manager.item.create({
            name: "South Park c'est mieux que les Simpsons",
            content: "Dans Sout Park Eric Cartman decoupe les parents d'un roux et lui fait manger dans un chili car il lui a vendu des poils de teube (S5-E4)",
            createdAt: new Date()
        });
        this.item_2.setToDoList(toDoListFixture.todo_list_for_user_remy);

        this.item_2 = await manager.item.create({
            name: "work",
            content: "Et ouais",
            createdAt: new Date()
        });
        this.item_2.setToDoList(toDoListFixture.todo_list_for_user_jean);
    }

    public async destroyFieldsTable(): Promise<void> {
        const manager = await SequelizeManager.getInstance();
        await manager.item.sequelize?.query('SET FOREIGN_KEY_CHECKS = 0');
        await manager.item.destroy({
            truncate: true,
            force: true
        });
    }
}
