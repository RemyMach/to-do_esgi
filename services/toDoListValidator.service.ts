import {ItemModel} from "../models/item.model";

export class ToDoListValidatorService
{
    public itemsIsNotFull(items: ItemModel[]){
        return items.length < 10;
    }

    public checkLastItemInsertTime(items: ItemModel[]): boolean
    {
        const currentDateTime = new Date();
        const lastItem = this.getLastItem(items);
        if(lastItem === null){
            return true;
        }
        currentDateTime.setMinutes(currentDateTime.getMinutes() - 30);
        return lastItem.createdAt < currentDateTime;
    }

    private getLastItem(items: ItemModel[]): ItemModel | null
    {
        if(this.getNumberOfItem(items) === 0){
            return null;
        }
        return items[this.getNumberOfItem(items) - 1];
    }

    public getNumberOfItem(items: ItemModel[]): number
    {
        return items.length;
    }
}

