import {ItemModel} from "./item.model";
import {ToDoListValidatorService} from "../services/toDoListValidator.service";

export interface ToDoListProps {
    toDoListValidatorService: ToDoListValidatorService;
    items: ItemModel[];
}

export class ToDoListModel implements ToDoListProps{
    toDoListValidatorService: ToDoListValidatorService;
    items: ItemModel[];

    constructor() {
        this.toDoListValidatorService = new ToDoListValidatorService();
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
    public addNewItem(item: ItemModel): ItemModel | null
    {
        if(this.toDoListValidatorService.itemsIsNotFull(this.items) &&
            this.toDoListValidatorService.checkLastItemInsertTime(this.items))
        {
            this.items.push(item);
            return item;
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
