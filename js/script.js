"use strict";
var Todo = (function () {
    function Todo(id, text, done) {
        if (id === void 0) { id = 0; }
        if (text === void 0) { text = ""; }
        if (done === void 0) { done = false; }
        this.id = id;
        this.text = text;
        this.done = done;
    }
    return Todo;
}());
var _a;
var ENTER_KEY = "Enter";
var ID_TODO_MASK = "todo_id_";
var ID_CHECKBOX_MASK = "checkbox_";
var TXT_TODO = document.getElementById("todo-text");
var TODO_LABEL_ERROR = document.getElementById("invalid-label");
var TEXT_LIMIT = 100;
(_a = document.getElementById("todo-text")) === null || _a === void 0 ? void 0 : _a.addEventListener("keydown", function (ev) {
    if (ev.key == ENTER_KEY) {
        onNew();
    }
});
window.addEventListener("load", function () {
    if (localStorage.getItem("todos") != null) {
        render();
    }
});
function onNew() {
    var input_text = document.getElementById("todo-text").value;
    var new_todo = new Todo(null, input_text, false);
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
    document.getElementById("todo-container").innerHTML = "";
    $('#modal-clear').modal('hide');
}
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
    var todo_container = document.createElement("div");
    todo_container.className = "card mt-2";
    todo_container.setAttribute("id", ID_TODO_MASK + note["id"]);
    var todo_content = document.createElement("div");
    todo_content.className = "d-flex p-1 align-items-center p-2";
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
    var text_container = document.createElement("div");
    text_container.className = "pr-1 flex-grow-1";
    var todo_paragraph = document.createElement("p");
    todo_paragraph.innerHTML = note["text"];
    todo_paragraph.style.wordBreak = "break-word";
    text_container.appendChild(todo_paragraph);
    var text_input = document.createElement("input");
    text_input.value = note["text"];
    text_input.classList.add("form-control");
    text_input.style.display = "none";
    text_input.maxLength = TEXT_LIMIT;
    text_input.addEventListener("keypress", function (evt) {
        if (evt.key == ENTER_KEY) {
            var todo = new Todo(note["id"], text_input.value.substring(0, TEXT_LIMIT), checkbox_done.checked);
            var localStorage_1 = new TodoLocalStorage();
            localStorage_1.update(todo);
            render();
        }
    });
    text_input.addEventListener("focusout", function () {
        todo_paragraph.style.display = "block";
        text_input.style.display = "none";
    });
    todo_paragraph.addEventListener("click", function () {
        todo_paragraph.style.display = "none";
        text_input.style.display = "block";
        text_input.focus();
    });
    text_container.appendChild(text_input);
    var button_container = document.createElement("div");
    button_container.className = "pr-1";
    var btn_delete = document.createElement("button");
    btn_delete.className = "btn text-primary";
    btn_delete.innerHTML = "\n        <svg width=\"15px\" color=\"#007bff\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\">\n            <path  style=\"fill:rgb(0,123,255);\" d=\"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z\"/>\n        </svg>";
    button_container.appendChild(btn_delete);
    if (note["done"] == true) {
        todo_paragraph.className = "text-todo-done";
        todo_content.classList.add("todo-done");
        checkbox_done.checked = true;
    }
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
    todo_container.style.cursor = "pointer";
    todo_container.appendChild(todo_content);
    todo_content.appendChild(checkbox_container);
    todo_content.appendChild(text_container);
    todo_content.appendChild(button_container);
    return todo_container;
}
function render() {
    var container = document.getElementById("todo-container");
    container.innerHTML = "";
    var todos = new TodoLocalStorage().fetchAll();
    if (todos == null || todos.length == 0) {
        $("#button-container").addClass("d-none");
        return;
    }
    $("#button-container").removeClass("d-none");
    var new_todos = buildList(todos);
    if (new_todos == null) {
        return;
    }
    container.appendChild(new_todos);
}
var TodoLocalStorage = (function () {
    function TodoLocalStorage() {
    }
    TodoLocalStorage.prototype.getTodos = function () {
        var _localStorage = localStorage.getItem("todos");
        if (_localStorage == null) {
            this.setTodos("[]");
            this.setContador(1);
            _localStorage = localStorage.getItem("todos");
        }
        var dados = JSON.parse(_localStorage);
        var notes = [];
        var length = dados.length;
        for (var i = 0; i < length; i++) {
            var new_note = dados[i];
            notes.push(new_note);
        }
        notes.sort(function (a, b) {
            var _a, _b;
            return ((_a = b.id) !== null && _a !== void 0 ? _a : 0) - ((_b = a.id) !== null && _b !== void 0 ? _b : 0);
        });
        return notes;
    };
    TodoLocalStorage.prototype.setTodos = function (new_notes) {
        if (localStorage.getItem("todos") == null) {
            localStorage.setItem("todos", "[]");
            this.setContador(1);
        }
        localStorage.setItem("todos", new_notes);
    };
    TodoLocalStorage.prototype.getContador = function () {
        if (localStorage.getItem("todo-counter") == null) {
            localStorage.setItem("todo-counter", "1");
        }
        return parseInt(localStorage.getItem("todo-counter"));
    };
    TodoLocalStorage.prototype.setContador = function (id) {
        if (localStorage.getItem("todo-counter") == null) {
            localStorage.setItem("todo-counter", "1");
        }
        localStorage.setItem("todo-counter", id.toString());
    };
    TodoLocalStorage.prototype.add = function (new_todo) {
        var notes = this.getTodos();
        var id = this.getContador();
        new_todo.id = id;
        notes.push(new_todo);
        this.setTodos(JSON.stringify(notes));
        this.setContador(id + 1);
        TXT_TODO.value = "";
    };
    TodoLocalStorage.prototype.fetchAll = function () {
        return this.getTodos();
    };
    TodoLocalStorage.prototype.getById = function (id) {
        var todos = this.getTodos();
        var length = todos.length;
        for (var i = 0; i < length; i++) {
            if (todos[i].id == id) {
                return todos[i];
            }
        }
        return null;
    };
    TodoLocalStorage.prototype.update = function (note_update) {
        var todos = this.getTodos();
        var length = todos.length;
        for (var i = 0; i < length; i++) {
            if (todos[i].id == note_update.id) {
                todos[i] = note_update;
                this.setTodos(JSON.stringify(todos));
                break;
            }
        }
    };
    TodoLocalStorage.prototype.deleteById = function (id) {
        var todos = JSON.parse(localStorage.getItem("todos"));
        var length = todos.length;
        for (var i = 0; i < length; i++) {
            if (todos[i]["id"] == id) {
                todos.splice(i, 1);
                break;
            }
        }
        this.setTodos(JSON.stringify(todos));
    };
    TodoLocalStorage.prototype.clear = function () {
        localStorage.clear();
    };
    return TodoLocalStorage;
}());
