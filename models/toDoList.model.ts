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

    /*
        TODO implémenter les 4 méthodes du dessous avec leur test sans oublier la vérification
        du name unique et du fait qu'on ai pas plus de 10 Items. Pour les vérification mieux d'utiliser
        des services que tu peux mocker pour les tests
    */

    public getItem(name: string): ItemModel {
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
