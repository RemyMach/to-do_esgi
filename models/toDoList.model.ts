import {ItemModel} from "./item.model";

export interface ToDoListProps {
    items: ItemModel[]
}

export class ToDoListModel implements ToDoListProps{
    items: ItemModel[];

    constructor() {
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
    public async addNewItem(item: ItemModel): Promise<boolean>
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

    private async getLastItemDateTime(): Promise<Date | null>
    {
        if(await this.getNumberOfItem() === 0){
            return null;
        }
        return this.items[await this.getNumberOfItem() - 1].createdAt;
    }

    public async getNumberOfItem(): Promise<number>
    {
        return this.items.length;
    }

    private async checkLastTimeInsertTime(): Promise<boolean>
    {
        const currentDateTime = new Date();
        const lastItemDateTime = await this.getLastItemDateTime();
        if(lastItemDateTime === null){
            return true;
        }
        currentDateTime.setMinutes(currentDateTime.getMinutes() - 30);
        return lastItemDateTime < currentDateTime;
    }

    private async sendMail(): Promise<void>
    {
        // Need to be implemented
    }

    /*
    update(item: Item) {

    }

    delete(item: Item) {

    }*/

}
