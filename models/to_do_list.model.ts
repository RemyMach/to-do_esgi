import {ItemModel} from "./item.model";

interface ToDoListProps {
    items: ItemModel[];
}

export class ToDoListModel implements ToDoListProps
{
    items: ItemModel[];

    constructor() {
        this.items = [];
    }

    public async addNewItem(item: ItemModel): Promise<boolean>
    {
        if(this.items.length >= 10 || !await this.checkLastTimeInsertTime()) {
            return false;
        }

        this.items.push(item);

        if(this.items.length === 8) {
            await this.sendMail();
        }

        return true;
    }

    private async getLastItemDateTime(): Promise<Date | null>
    {
        if(await this.getNumberOfItem() === 0){
            return null;
        }
        return this.items[await this.getNumberOfItem() - 1].createdAt;
    }

    public async getNumberOfItem(): Promise<number>
    {
        return this.items.length;
    }

    private async checkLastTimeInsertTime(): Promise<boolean>
    {
        const currentDateTime = new Date();
        const lastItemDateTime = await this.getLastItemDateTime();
        if(lastItemDateTime === null){
            return true;
        }
        currentDateTime.setMinutes(currentDateTime.getMinutes() - 30);
        return lastItemDateTime < currentDateTime;
    }

    private async sendMail(): Promise<void>
    {
        // Need to be implemented
    }
}
