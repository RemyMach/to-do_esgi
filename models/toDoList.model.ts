import {ItemModel} from "./item.model";
import {ToDoListValidatorService} from "../services/toDoListValidator.service";
import {DateService} from "../services/date.service";
import {EmailService} from "../services/email.service";

export interface ToDoListProps {
    toDoListValidatorService: ToDoListValidatorService;
    dateService: DateService;
    items: ItemModel[];
}

export class ToDoListModel implements ToDoListProps{
    toDoListValidatorService: ToDoListValidatorService;
    dateService: DateService;
    emailService: EmailService;
    items: ItemModel[];

    constructor() {
        this.toDoListValidatorService = new ToDoListValidatorService();
        this.dateService = new DateService();
        this.emailService = new EmailService();
        this.items = [];
    }

    public getItem(name: string): ItemModel | null {
        return this.toDoListValidatorService.searchItemByName(name, this.items);
    }

    public addNewItem(newItem: ItemModel): ItemModel | null
    {
        if(this.toDoListValidatorService.itemsIsEmpty(this.items)){
            this.items.push(newItem);
            return newItem;
        }

        if(this.toDoListValidatorService.itemsIsNotFull(this.items) &&
            this.toDoListValidatorService.newItemNameIsUnique(this.items, newItem) &&
            this.dateService.isItemCreationDateStamped(this.toDoListValidatorService.getLastItem(this.items), newItem))
        {
            this.items.push(newItem);
            if(this.toDoListValidatorService.getNumberOfItem(this.items) >= 8){
                this.emailService.sendEmail("Il ne vous reste plus que 2 items à ajouter");
            }
            return newItem;
        }
        else{
            return null;
        }
    }
    public updateItem(name: string, content: string) : ItemModel | null
    {
        if(this.toDoListValidatorService.searchItemByName(name, this.items) === null){
            return null;
        }
        this.items = this.toDoListValidatorService.updateItemContent(name, content, this.items);
        return this.toDoListValidatorService.searchItemByName(name, this.items);
    }

    /*delete(item: Item) {

    }*/

}
