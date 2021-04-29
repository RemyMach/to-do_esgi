import {Item} from "./item.model";

interface ToDoListProps {
    items: Item[];
}

export class ToDoList implements ToDoListProps
{
    items: Item[];

    constructor() {
        this.items = [];
    }
}
