export interface fixture {

    fillTable(): Promise<void>;
    destroyFieldsTable(): Promise<void>;
}
