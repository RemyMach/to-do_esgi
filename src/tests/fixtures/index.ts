import {UserFixture} from './user.fixture';
import {SessionFixture} from "./session.fixture";
import {ItemFixture} from "./item.fixture";
import {ToDoListFixture} from "./toDoList.fixture";


export async function fillTables(): Promise<void> {

    const userFixture = await UserFixture.getInstance();
    const sessionFixture = await SessionFixture.getInstance();
    const itemFixture = await ItemFixture.getInstance();
    const toDoListFixture = await ToDoListFixture.getInstance();

    await userFixture.fillTable();
    await sessionFixture.fillTable();
    await itemFixture.fillTable();
    await toDoListFixture.fillTable();
}

export async function destroyTablesElement(): Promise<void> {

    const userFixture = await UserFixture.getInstance();
    const sessionFixture = await SessionFixture.getInstance();
    const itemFixture = await ItemFixture.getInstance();
    const toDoListFixture = await ToDoListFixture.getInstance();

    await sessionFixture.destroyFieldsTable();
    await userFixture.destroyFieldsTable();
    await itemFixture.destroyFieldsTable();
    await toDoListFixture.destroyFieldsTable();
}
