import {ItemModel} from "../models/item.model";

export class ToDoListValidatorService
{
    public itemsIsNotFull(items: ItemModel[]){
        return items.length < 10;
    }

    getLastItem(items: ItemModel[]): ItemModel
    {
        return items[this.getNumberOfItem(items) - 1];
    }

    public getNumberOfItem(items: ItemModel[]): number
    {
        return items.length;
    }

    itemsIsEmpty(items: ItemModel[]) {
        return items.length === 0;
    }

    newItemNameIsUnique(items: ItemModel[], newItem: ItemModel) {
        return items.filter(item => item.name === newItem.name).length === 0;
    }
}

