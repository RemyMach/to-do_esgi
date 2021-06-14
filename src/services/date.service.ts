import {ItemModel} from "../models/item.model";

export class DateService {

    isBirthdateValid(birthdate: Date): boolean {
        birthdate.setUTCFullYear(birthdate.getUTCFullYear() + 13);
        return birthdate.getTime() <= (new Date()).getTime();
    }

    isItemCreationDateStamped(lastItem: ItemModel, newItem: ItemModel): boolean {
        const lastItemCreationDate = new Date(lastItem.createdAt.getTime() + 30 * 60 * 1000);
        const newItemCreationDate = newItem.createdAt;
        return lastItemCreationDate.getTime() < newItemCreationDate.getTime();
    }
}
