import {Item} from "./item.model";

interface ToDoListProps {
    items: Item[];
}

export class ToDoListModel implements ToDoListProps
{
    items: Item[];

    constructor() {
        this.items = [];
    }

    public async addNewItem(item: Item): Promise<boolean>
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

    private async getLastItemDateTime(): Promise<Date>
    {
        return this.items[this.items.length - 1].createdAt;
    }

    private async checkLastTimeInsertTime(): Promise<boolean>
    {
        const currentDateTime = new Date();
        currentDateTime.setMinutes(currentDateTime.getMinutes() - 30);
        console.log(currentDateTime);
        return await this.getLastItemDateTime() < currentDateTime;
    }

    private async sendMail(): Promise<void>
    {
        // Need to be implemented
    }
}
