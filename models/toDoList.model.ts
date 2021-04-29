import {ItemModel} from "./item.model";

export interface ToDoListProps {
    items: ItemModel[]
}

export class ToDoListModel implements ToDoListProps{
    items: ItemModel[];

    constructor(items: ItemModel[]) {
        this.items = items;
    }

    /*TODO implémenter les 4 méthodes du dessous avec leur test sans oublier la vérification
       du name unique et du fait qu'on ai pas plus de 10 Items. Pour les vérification mieux d'utiliser
       des services que tu peux mocker pour les tests
    */
    /*get(name: string): ItemModel {

    }

    add(item: Item) {

    }

    update(item: Item) {

    }

    delete(item: Item) {

    }*/

}