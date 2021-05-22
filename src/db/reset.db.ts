import {destroyTablesElement, fillTables} from "../tests/fixtures";

async function main() {
    await destroyTablesElement();
    await fillTables();
}

main()
