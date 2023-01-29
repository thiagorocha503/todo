export class Todo {
    id: number;
    text: string;
    done: boolean;
    createdAt: Date;
    constructor(
        text: string,
        done: boolean = false,
        createdAt: Date = new Date(),
        id: number = 0
    ) {
        this.id = id;
        this.text = text;
        this.done = done;
        this.createdAt = createdAt;
    }
}
