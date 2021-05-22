import {UserFixture} from './user.fixture';
import {SessionFixture} from "./session.fixture";



export async function fillTables(): Promise<void> {

    const userFixture = await UserFixture.getInstance();
    const sessionFixture = await SessionFixture.getInstance();

    await userFixture.fillTable();
    await sessionFixture.fillTable();
}

export async function destroyTablesElement(): Promise<void> {

    const userFixture = await UserFixture.getInstance();
    const sessionFixture = await SessionFixture.getInstance();


    await sessionFixture.destroyFieldsTable();
    await userFixture.destroyFieldsTable();
}
