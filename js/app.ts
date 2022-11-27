const ENTER_KEY: string = "Enter";
const ID_TODO_MASK = "todo_id_";
const ID_CHECKBOX_MASK = "checkbox_";
const TEXT_LIMIT = 100;

interface Map {
    [K: string]: any;
}

$("#todo-input").on("keydown",(ev)=>{
    if (ev.key == ENTER_KEY) {
        onNew();
    }
});

$(window).on("load", function () {
    if(localStorage.getItem("todos") != null){
        render();
    }
});

function onNew(): void {
    let input_text: string = (document.getElementById("todo-input") as HTMLInputElement).value;
    let new_todo: Todo = new Todo(null, input_text, false, new Date());
    // clear 
    $("#todo-input").removeClass("is-invalid")
    $("#invalid-label").removeClass("d-block")
    
    if (input_text.length == 0) {
        $("#todo-input").addClass("is-invalid")
        $("#invalid-label").addClass("d-block")
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
    render();
}

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

function buildItemList(todo: Map): HTMLElement {
    // todo container
    let card: HTMLDivElement = document.createElement("div");
    card.className = "card mt-2";
    card.style.cursor = "pointer";
    card.setAttribute("id", ID_TODO_MASK + todo["id"]);
    // todo content
    let card_body: HTMLDivElement = document.createElement("div");
    card_body.className = " card-body d-flex p-1 align-items-center p-2";
    
    
    let leading: HTMLDivElement = document.createElement("div");
    leading.className = "px-2";
    
    // checkbox container
    let checkbox_content: HTMLDivElement = document.createElement("div");
    let checkbox_done = document.createElement("input");
    let checkbox_label = document.createElement("label");
    checkbox_content.className = "custom-control custom-checkbox";
    checkbox_done.setAttribute("id", ID_CHECKBOX_MASK+todo["id"]);
    checkbox_done.className = "custom-control-input";
    checkbox_done.setAttribute("type","checkbox");
    checkbox_label.className = "custom-control-label";
    checkbox_label.innerHTML = "";
    checkbox_label.setAttribute("for",ID_CHECKBOX_MASK+todo["id"]);
  
    leading.appendChild(checkbox_content);
    checkbox_content.appendChild(checkbox_done);
    checkbox_content.appendChild(checkbox_label);
    
    // text container
    let title: HTMLDivElement = document.createElement("div");
    title.className = "pr-1 flex-grow-1";
    let paragraph: HTMLParagraphElement = document.createElement("p");
    paragraph.innerHTML = todo["text"];
    paragraph.style.wordBreak = "break-word";
    title.appendChild(paragraph);
    
    // text input
    let text_input: HTMLInputElement = document.createElement("input");
    text_input.value = todo["text"];
    text_input.classList.add("form-control")
    text_input.style.display = "none";
    text_input.maxLength = TEXT_LIMIT  
    title.appendChild(text_input);
    
    let tralling: HTMLDivElement = document.createElement("div");
    tralling.className = "pr-1";
    let btn_delete: HTMLButtonElement = document.createElement("button");
    btn_delete.className = "btn text-primary";
    btn_delete.innerHTML = `
        <svg width="15px" color="#007bff" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path  style="fill:rgb(0,123,255);" d="M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z"/>
        </svg>`;
    btn_delete.style.display = "none";
    let date = document.createElement("p");
    date.innerHTML =  strDate(new Date(todo["createdAt"]));
    tralling.appendChild(date)
    tralling.appendChild(btn_delete);
    text_input.addEventListener("keypress",(evt)=>{
        if(evt.key == ENTER_KEY ){
            let newtodo: Todo = new Todo(
                todo["id"], 
                text_input.value.substring(0,TEXT_LIMIT),
                checkbox_done.checked,
                todo["createdAt"]

            );
            let localStorage = new TodoLocalStorage();
            localStorage.update(newtodo);
            render();           
        }
    }) 
    text_input.addEventListener("focusout",()=>{
        paragraph.style.display = "block";
        text_input.style.display = "none";
        btn_delete.style.display = "block";
        
    })
    paragraph.addEventListener("click",()=>{
        paragraph.style.display = "none";
        text_input.style.display = "block";
        text_input.focus();
        btn_delete.style.display = "none";
        text_input.classList.add("has-focus")
       
    });
    // set checkbox
    if (todo["done"] == true) {
        paragraph.className = "text-todo-done";
        card_body.classList.add("todo-done");
        checkbox_done.checked = true;
    }
    btn_delete.addEventListener("click", ()=>{deleteTodo(todo["id"])});
    checkbox_done.addEventListener("change", function () {
        if (this.checked) {
            paragraph.className = "text-todo-done";
            card_body.classList.add("todo-done");
            setTodoDone(todo["id"], true);
        } else {
            paragraph.classList.remove("text-todo-done");
            card_body.classList.remove("todo-done");
            setTodoDone(todo["id"], false);
        }
    });  
    card.addEventListener("mouseenter",()=>{
        if(!text_input.classList.contains("has-focus")){
            btn_delete.style.display = "block";
            date.style.display = "none"
        }
       
    })
    card.addEventListener("mouseleave",()=>{
        if(!text_input.classList.contains("has-focus")){
            btn_delete.style.display = "none";
            date.style.display = "block";
        }   
    })
    // build card
    card.appendChild(card_body);
    card_body.appendChild(leading);
    card_body.appendChild(title);
    card_body.appendChild(tralling);
    return card;
}

function render(): void {
    let container: HTMLElement = document.getElementById("todo-container") as HTMLElement;
    // limpa lista anterior
    container.innerHTML = "";
    let todos: Array<Todo> = new TodoLocalStorage().fetchAll();
    if (todos == null || todos.length == 0) {
        $("#button-container").addClass("d-none")
        return;
    }
    $("#button-container").removeClass("d-none");
    let new_todos = buildList(todos);
    if(new_todos == null){
        return;
    }
    container.appendChild(new_todos);

}

function deleteTodo(id: number) {
    new TodoLocalStorage().deleteById(id);
    render();
    
}
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