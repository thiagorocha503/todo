//------------ Model -----------------------------
class Todo {
    id: number | null;
    text: string;
    done: boolean;
    createdAt: Date;
    constructor(id: number | null = 0, text: string, done: boolean = false, createdAt: Date) {
        this.id = id;
        this.text = text;
        this.done = done;
        this.createdAt = createdAt;
    }

}
