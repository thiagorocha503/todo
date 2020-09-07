"use strict";
var _a;
var ENTER_KEY = 13;
var ID_TODO_MASK = "todo_id_";
var ID_CHECKBOX_MASK = "checkbox_";
var BTN_CLEAR = document.getElementById("btn-clear");
var TXT_TODO = document.getElementById("todo-text");
var TODO_LABEL_ERROR = document.getElementById("invalid-label");
// ------------- events -----------------------------
// Enter input note
(_a = document.getElementById("todo-text")) === null || _a === void 0 ? void 0 : _a.addEventListener("keydown", function (ev) {
    if (ev.keyCode == ENTER_KEY) {
        onNew();
    }
});
// load event
window.addEventListener("load", function () {
    render();
});
function onNew() {
    var input_text = document.getElementById("todo-text").value;
    var new_todo = new Todo(null, input_text, false);
    // clear 
    TXT_TODO.classList.remove("is-invalid");
    TODO_LABEL_ERROR === null || TODO_LABEL_ERROR === void 0 ? void 0 : TODO_LABEL_ERROR.classList.remove("d-block");
    if (input_text.length == 0) {
        TXT_TODO.classList.add("is-invalid");
        TODO_LABEL_ERROR === null || TODO_LABEL_ERROR === void 0 ? void 0 : TODO_LABEL_ERROR.classList.add("d-block");
        return;
    }
    var noteLocalStorage = new TodoLocalStorage();
    noteLocalStorage.add(new_todo);
    render();
}
function onDelete(id) {
    var noteLocalStorage = new TodoLocalStorage();
    noteLocalStorage.deleteById(id);
    render();
}
function showModalClear() {
    document.getElementById("modal-clear").style.display = "block";
    $('#modal-clear').modal('show');
}
function onClear() {
    var noteLocalStorage = new TodoLocalStorage();
    noteLocalStorage.clear();
    render();
    $('#modal-clear').modal('hide');
}
// --------- View -------------
function buildList(valores) {
    var todos = new TodoLocalStorage().fetchAll();
    if (todos == null) {
        console.log("Erro: erro ao obter todos os todos");
        return null;
    }
    var todos_list = document.createElement("div");
    todos_list.className = "col-12";
    for (var i = 0; i < todos.length; i++) {
        var todo_item = buildItemList(todos[i]);
        if (todo_item == null) {
            continue;
        }
        todos_list.appendChild(todo_item);
    }
    return todos_list;
}
function setTodoDone(id, check) {
    var _localStorage = new TodoLocalStorage();
    var todo = _localStorage.getById(id);
    if (todo == null) {
        return;
    }
    todo.done = check;
    _localStorage.update(todo);
}
function buildItemList(note) {
    // todo container
    var todo_container = document.createElement("div");
    todo_container.className = "card  m-1";
    todo_container.setAttribute("id", ID_TODO_MASK + note["id"]);
    // todo content
    var todo_content = document.createElement("div");
    todo_content.className = "d-flex p-1 align-items-center";
    // checkbox container
    var checkbox_container = document.createElement("div");
    checkbox_container.className = "px-2";
    var checkbox_content = document.createElement("div");
    var checkbox_done = document.createElement("input");
    var checkbox_label = document.createElement("label");
    checkbox_content.className = "custom-control custom-checkbox";
    checkbox_done.setAttribute("id", ID_CHECKBOX_MASK + note["id"]);
    checkbox_done.className = "custom-control-input";
    checkbox_done.setAttribute("type", "checkbox");
    checkbox_label.className = "custom-control-label";
    checkbox_label.innerHTML = "";
    checkbox_label.setAttribute("for", ID_CHECKBOX_MASK + note["id"]);
    checkbox_container.appendChild(checkbox_content);
    checkbox_content.appendChild(checkbox_done);
    checkbox_content.appendChild(checkbox_label);
    // text container
    var text_container = document.createElement("div");
    text_container.className = "pr-1 flex-grow-1";
    var todo_paragraph = document.createElement("p");
    todo_paragraph.innerHTML = note["text"];
    todo_paragraph.style.wordBreak = "break-word";
    text_container.appendChild(todo_paragraph);
    // Todo button 
    var button_container = document.createElement("div");
    button_container.className = "pr-1";
    var btn_delete = document.createElement("button");
    btn_delete.className = "btn text-primary";
    btn_delete.innerHTML = "\n        <svg width=\"15px\" color=\"#007bff\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\">\n            <path  style=\"fill:rgb(0,123,255);\" d=\"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z\"/>\n        </svg>";
    button_container.appendChild(btn_delete);
    // set checkbox
    if (note["done"] == true) {
        todo_paragraph.className = "text-todo-done";
        todo_content.classList.add("todo-done");
        checkbox_done.checked = true;
    }
    // Add listeners
    btn_delete.addEventListener("click", function () {
        var id = parseInt(todo_container.getAttribute("id").replace(ID_TODO_MASK, ""));
        new TodoLocalStorage().deleteById(id);
        render();
    });
    checkbox_done.addEventListener("change", function () {
        if (this.checked) {
            todo_paragraph.className = "text-todo-done";
            todo_content.classList.add("todo-done");
            setTodoDone(note["id"], true);
        }
        else {
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
function render() {
    //console.log(">> render");
    var container = document.getElementById("todo-container");
    // limpa lista anterior
    container.innerHTML = "";
    BTN_CLEAR === null || BTN_CLEAR === void 0 ? void 0 : BTN_CLEAR.classList.add("d-none");
    var todos = new TodoLocalStorage().fetchAll();
    if (todos == null || todos.length == 0) {
        return;
    }
    BTN_CLEAR === null || BTN_CLEAR === void 0 ? void 0 : BTN_CLEAR.classList.remove("d-none");
    var new_todos = buildList(todos);
    if (new_todos == null) {
        return;
    }
    container.appendChild(new_todos);
}
BTN_CLEAR === null || BTN_CLEAR === void 0 ? void 0 : BTN_CLEAR.classList.add("d-none");
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
