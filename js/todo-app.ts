const ENTER_KEY: number = 13;
const ID_TODO_MASK = "todo_id_";
const ID_CHECKBOX_MASK = "checkbox_";
const BTN_CLEAR = document.getElementById("btn-clear");
const TXT_TODO: HTMLInputElement = document.getElementById("todo-text") as HTMLInputElement;
const TODO_LABEL_ERROR = document.getElementById("invalid-label");
//

interface Map {
    [K: string]: any;
}

// ------------- events -----------------------------
// Enter input note
document.getElementById("todo-text")?.addEventListener("keydown", function (ev: KeyboardEvent) {
    if (ev.keyCode == ENTER_KEY) {
        onNew();
    }
});
// load event
window.addEventListener("load", function () {
    if(localStorage.getItem("todos") != null){
        render();
    }
});


function onNew(): void {
    let input_text: string = (document.getElementById("todo-text") as HTMLInputElement).value;
    let new_todo: Todo = new Todo(null, input_text, false);
    // clear 
    TXT_TODO.classList.remove("is-invalid");
    TODO_LABEL_ERROR?.classList.remove("d-block");
    
    if (input_text.length == 0) {
        TXT_TODO.classList.add("is-invalid");
        TODO_LABEL_ERROR?.classList.add("d-block");
        return;
    }
    let noteLocalStorage = new TodoLocalStorage();
    noteLocalStorage.add(new_todo);
    render();
}

function onDelete(id: number): void {
    let noteLocalStorage = new TodoLocalStorage();
    noteLocalStorage.deleteById(id);
    render();
}

function showModalClear(){
   (document.getElementById("modal-clear") as HTMLElement).style.display = "block";
    $('#modal-clear').modal('show');
}

function onClear(): void {
    let noteLocalStorage = new TodoLocalStorage();
    noteLocalStorage.clear();
    (document.getElementById("todo-container")as HTMLElement).innerHTML = ""
    $('#modal-clear').modal('hide');
}


// --------- View -------------
function buildList(valores: Array<Todo>): HTMLElement| null {
    let todos: Array<Todo> = new TodoLocalStorage().fetchAll();
    if (todos == null) {
        console.log("Erro: erro ao obter todos os todos");
        return null;
    }
    let todos_list = document.createElement("div");
    todos_list.className = "col-12";
    for (let i = 0; i < todos.length; i++) {
        let todo_item = buildItemList(todos[i]);
        if (todo_item == null) {
            continue;
        }
        todos_list.appendChild(todo_item);
    }
    return todos_list;
}

function setTodoDone(id: number, check: boolean) {
    let _localStorage = new TodoLocalStorage();
    let todo = _localStorage.getById(id);
    if (todo == null) {
        return;
    }
    todo.done = check;
    _localStorage.update(todo);
}

function buildItemList(note: Map): HTMLElement {
    // todo container
    let todo_container: HTMLDivElement = document.createElement("div");
    todo_container.className = "card  m-1";
    todo_container.setAttribute("id", ID_TODO_MASK + note["id"]);
    // todo content
    let todo_content: HTMLDivElement = document.createElement("div");
    todo_content.className = "d-flex p-1 align-items-center";
    // checkbox container
    let checkbox_container: HTMLDivElement = document.createElement("div");
    checkbox_container.className = "px-2";
    
    let checkbox_content: HTMLDivElement = document.createElement("div");
    let checkbox_done = document.createElement("input");
    let checkbox_label = document.createElement("label");
    checkbox_content.className = "custom-control custom-checkbox";
    checkbox_done.setAttribute("id", ID_CHECKBOX_MASK+note["id"]);
    checkbox_done.className = "custom-control-input";
    checkbox_done.setAttribute("type","checkbox");
    checkbox_label.className = "custom-control-label";
    checkbox_label.innerHTML = "";
    checkbox_label.setAttribute("for",ID_CHECKBOX_MASK+note["id"]);
    
    checkbox_container.appendChild(checkbox_content);
    checkbox_content.appendChild(checkbox_done);
    checkbox_content.appendChild(checkbox_label);
    // text container
    let text_container: HTMLDivElement = document.createElement("div");
    text_container.className = "pr-1 flex-grow-1";
    let todo_paragraph: HTMLParagraphElement = document.createElement("p");
    todo_paragraph.innerHTML = note["text"];
    todo_paragraph.style.wordBreak = "break-word";
    text_container.appendChild(todo_paragraph);
    // Todo button 
    let button_container: HTMLDivElement = document.createElement("div");
    button_container.className = "pr-1";
    let btn_delete: HTMLButtonElement = document.createElement("button");
    btn_delete.className = "btn text-primary";
    btn_delete.innerHTML = `
        <svg width="15px" color="#007bff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path  style="fill:rgb(0,123,255);" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/>
        </svg>`;
    button_container.appendChild(btn_delete);
    // set checkbox
    if (note["done"] == true) {
        todo_paragraph.className = "text-todo-done";
        todo_content.classList.add("todo-done");
        checkbox_done.checked = true;
    }
    // Add listeners
    btn_delete.addEventListener("click", function () {
        let id: number = parseInt((todo_container.getAttribute("id") as string).replace(ID_TODO_MASK, ""));
        new TodoLocalStorage().deleteById(id);
        render();
    });
    checkbox_done.addEventListener("change", function () {
        if (this.checked) {
            todo_paragraph.className = "text-todo-done";
            todo_content.classList.add("todo-done");
            setTodoDone(note["id"], true);
        } else {
            todo_paragraph.classList.remove("text-todo-done");
            todo_content.classList.remove("todo-done");
            setTodoDone(note["id"], false);
        }
    });
    // monta todo
    todo_container.appendChild(todo_content);
    todo_content.appendChild(checkbox_container);
    todo_content.appendChild(text_container);
    todo_content.appendChild(button_container);
    return todo_container;
}

function render(): void {
    //console.log(">> render");
    let container: HTMLElement = document.getElementById("todo-container") as HTMLElement;
    // limpa lista anterior
    container.innerHTML = "";
    BTN_CLEAR?.classList.add("d-none");
    let todos: Array<Todo> = new TodoLocalStorage().fetchAll();
    if (todos == null || todos.length == 0) {
        return;
    }
    BTN_CLEAR?.classList.remove("d-none");
    let new_todos = buildList(todos);
    if(new_todos == null){
        return;
    }
    container.appendChild(new_todos);

}
BTN_CLEAR?.classList.add("d-none");
/*
    // Todo item
    <div class="card p-1 m-1">
        <div class="d-flex align-items-center">
            <div class="px-2">
                <div class="form-check mx-1 my-1">
                    <input class="form-check-input position-static" type="checkbox">
                </div>
            </div>
            <div class="pr-1 flex-grow-1">
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempus varius ex
                </p>
            </div>
            <div class="pr-1">
                <button class="btn text-primary">
                    <i class="fas fa-trash"></i>
                    <span class="sr-only">Delete</span>
                </button>
            </div>
        </div>
    </div><!--End To do item-->
*/