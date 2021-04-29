import {ItemValidatorService} from '../services/itemValidator.service'

interface ItemProps {
    name: string;
    content: string;
    createdAt: Date;
}

export class ItemModel implements ItemProps {

    itemValidator: ItemValidatorService;
    content: string;
    createdAt: Date;
    name: string;


    constructor(content: string, createdAt: Date, name: string) {
        this.content = content;
        this.createdAt = createdAt;
        this.name = name;
        this.itemValidator = new ItemValidatorService();
    }

    isValid(): boolean {

        return this.itemValidator.isContentValid(this.content)
            && this.itemValidator.isNameNotEmpty(this.name)
            && this.itemValidator.isCreatedDateValid(this.createdAt);
    }
}