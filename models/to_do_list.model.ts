import {Item} from "./item.model";

interface ToDoListProps {
    items: Item[];
}

export class ToDoListModel implements ToDoListProps
{
    items: Item[];

    constructor() {
        this.items = [];
    }
}
