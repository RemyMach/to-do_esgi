import {ItemModel} from "./item.model";
import {ToDoListValidatorService} from "../services/toDoListValidator.service";
import {DateService} from "../services/date.service";

export interface ToDoListProps {
    toDoListValidatorService: ToDoListValidatorService;
    dateService: DateService;
    items: ItemModel[];
}

export class ToDoListModel implements ToDoListProps{
    toDoListValidatorService: ToDoListValidatorService;
    dateService: DateService;
    items: ItemModel[];

    constructor() {
        this.toDoListValidatorService = new ToDoListValidatorService();
        this.dateService = new DateService();
        this.items = [];
    }

    /*
        TODO implémenter les 4 méthodes du dessous avec leur test sans oublier la vérification
        du name unique et du fait qu'on ai pas plus de 10 Items. Pour les vérification mieux d'utiliser
        des services que tu peux mocker pour les tests
    */

    /*get(name: string): ItemModel {

    }
    */
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
            return newItem;
        }
        else{
            return null;
        }
    }

    private sendMail(): void
    {
        // Need implement "to be implemented" exception
    }

    /*
    update(item: Item) {

    }

    delete(item: Item) {

    }*/

}
