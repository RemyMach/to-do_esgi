interface ItemProps {
    name: string;
    content: string;
    createdAt: Date;
}

export class Item implements ItemProps {
    content: string;
    createdAt: Date;
    name: string;


    constructor(content: string, createdAt: Date, name: string) {
        this.content = content;
        this.createdAt = createdAt;
        this.name = name;
    }
}