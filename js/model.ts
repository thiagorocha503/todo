//------------ Model -----------------------------
class Todo {
    id: number | null;
    text: string;
    done: boolean;
    constructor(id: number | null = 0, text: string = "", done: boolean = false) {
        this.id = id;
        this.text = text;
        this.done = done;
    }

}
