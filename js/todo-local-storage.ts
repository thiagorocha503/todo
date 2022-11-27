// ----------  Localstorage ------------
class TodoLocalStorage {

    constructor() { }

    private getTodos(): Array<Todo> {
        let _localStorage: string = localStorage.getItem("todos") as string;
        if (_localStorage == null) {
            this.setTodos("[]");
            this.setContador(1);
            _localStorage = localStorage.getItem("todos") as string;
        }
        let dados: Array<any> = JSON.parse(_localStorage);
        let notes: Array<Todo> = [];
        let length: number = dados.length;
        for (let i = 0; i < length; i++) {
            let new_note: Todo = dados[i];
            notes.push(new_note);
        }
        notes.sort((a: Todo, b: Todo) =>{
            return  (b.id ?? 0) - (a.id ?? 0);
        });
        return notes;

    }
    private setTodos(new_notes: string): void {
        if (localStorage.getItem("todos") == null) {
            localStorage.setItem("todos", "[]");
            this.setContador(1);
        }
        localStorage.setItem("todos", new_notes);
    }

    private getContador(): number {
        if (localStorage.getItem("todo-counter") == null) {
            localStorage.setItem("todo-counter", "1");
        }
        return parseInt(localStorage.getItem("todo-counter") as string);
    }

    private setContador(id: number): void {
        if (localStorage.getItem("todo-counter") == null) {
            localStorage.setItem("todo-counter", "1");
        }
        localStorage.setItem("todo-counter", id.toString());
    }

    public add(new_todo: Todo): void {
        let notes: Array<Todo> = this.getTodos();

        let id: number = this.getContador();
        new_todo.id = id;
        notes.push(new_todo);
        // set datas
        this.setTodos(JSON.stringify(notes));
        this.setContador(id + 1);
        TXT_TODO.value = "";
    }

    public fetchAll(): Array<Todo> {
        return this.getTodos();
    }

    public getById(id: number): Todo | null {
        let todos: Array<Todo> = this.getTodos();
        let length: number = todos.length;
        for (let i = 0; i < length; i++) {
            if (todos[i].id == id) {
                return todos[i];
            }
        }
        return null;

    }

    public update(note_update: Todo): void {
        let todos: Array<Todo> = this.getTodos();
        let length: number = todos.length;
        for (let i = 0; i < length; i++) {
            if (todos[i].id == note_update.id) {
                todos[i] = note_update;
                this.setTodos(JSON.stringify(todos));
                break;
            }
        }

    }

    public deleteById(id: number): void {
        let todos: Array<Map> = JSON.parse(localStorage.getItem("todos") as string);
        let length: number = todos.length;
        for (let i = 0; i < length; i++) {
            if (todos[i]["id"] == id) {
                todos.splice(i, 1);
                break;
            }
        }
        this.setTodos(JSON.stringify(todos));

    }

    public clear(): void {
        localStorage.clear();

    }
}
