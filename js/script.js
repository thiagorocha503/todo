"use strict";
var ENTER_KEY = "Enter";
var ID_TODO_MASK = "todo_id_";
var ID_CHECKBOX_MASK = "checkbox_";
var TEXT_LIMIT = 100;
$("#todo-input").on("keydown", function (ev) {
    if (ev.key == ENTER_KEY) {
        onNew();
        $("#todo-input").val("");
    }
});
$(window).on("load", function () {
    if (localStorage.getItem("todos") != null) {
        render();
    }
});
function onNew() {
    var input_text = $("#todo-input").val();
    var new_todo = new Todo(null, input_text, false, new Date());
    $("#todo-input").removeClass("is-invalid");
    $("#invalid-label").removeClass("d-block");
    if (input_text.length == 0) {
        $("#todo-input").addClass("is-invalid");
        $("#invalid-label").addClass("d-block");
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
    render();
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
function buildItemList(todo) {
    var card = document.createElement("div");
    card.className = "card mt-2";
    card.style.cursor = "pointer";
    card.setAttribute("id", ID_TODO_MASK + todo["id"]);
    var card_body = document.createElement("div");
    card_body.className = " card-body d-flex p-1 align-items-center p-2";
    var leading = document.createElement("div");
    leading.className = "px-2";
    var checkbox_content = document.createElement("div");
    var checkbox_done = document.createElement("input");
    var checkbox_label = document.createElement("label");
    checkbox_content.className = "custom-control custom-checkbox";
    checkbox_done.setAttribute("id", ID_CHECKBOX_MASK + todo["id"]);
    checkbox_done.className = "custom-control-input";
    checkbox_done.setAttribute("type", "checkbox");
    checkbox_label.className = "custom-control-label";
    checkbox_label.innerHTML = "";
    checkbox_label.setAttribute("for", ID_CHECKBOX_MASK + todo["id"]);
    leading.appendChild(checkbox_content);
    checkbox_content.appendChild(checkbox_done);
    checkbox_content.appendChild(checkbox_label);
    var title = document.createElement("div");
    title.className = "pr-1 flex-grow-1";
    var paragraph = document.createElement("p");
    paragraph.innerHTML = todo["text"];
    paragraph.style.wordBreak = "break-word";
    title.appendChild(paragraph);
    var text_input = document.createElement("input");
    text_input.value = todo["text"];
    text_input.classList.add("form-control");
    text_input.style.display = "none";
    text_input.maxLength = TEXT_LIMIT;
    title.appendChild(text_input);
    var tralling = document.createElement("div");
    tralling.className = "pr-1";
    var btn_delete = document.createElement("button");
    btn_delete.className = "btn text-primary";
    btn_delete.innerHTML = "\n        <svg width=\"15px\" color=\"#007bff\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 448 512\">\n            <path  style=\"fill:rgb(0,123,255);\" d=\"M432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16zM53.2 467a48 48 0 0 0 47.9 45h245.8a48 48 0 0 0 47.9-45L416 128H32z\"/>\n        </svg>";
    btn_delete.style.display = "none";
    var date = document.createElement("p");
    date.innerHTML = strDate(new Date(todo["createdAt"]));
    tralling.appendChild(date);
    tralling.appendChild(btn_delete);
    text_input.addEventListener("keypress", function (evt) {
        if (evt.key == ENTER_KEY) {
            var newtodo = new Todo(todo["id"], text_input.value.substring(0, TEXT_LIMIT), checkbox_done.checked, todo["createdAt"]);
            var localStorage_1 = new TodoLocalStorage();
            localStorage_1.update(newtodo);
            render();
        }
    });
    text_input.addEventListener("focusout", function () {
        paragraph.style.display = "block";
        text_input.style.display = "none";
        btn_delete.style.display = "block";
    });
    paragraph.addEventListener("click", function () {
        paragraph.style.display = "none";
        text_input.style.display = "block";
        text_input.focus();
        btn_delete.style.display = "none";
        text_input.classList.add("has-focus");
    });
    if (todo["done"] == true) {
        paragraph.className = "text-todo-done";
        card_body.classList.add("todo-done");
        checkbox_done.checked = true;
    }
    btn_delete.addEventListener("click", function () { deleteTodo(todo["id"]); });
    checkbox_done.addEventListener("change", function () {
        if (this.checked) {
            paragraph.className = "text-todo-done";
            card_body.classList.add("todo-done");
            setTodoDone(todo["id"], true);
        }
        else {
            paragraph.classList.remove("text-todo-done");
            card_body.classList.remove("todo-done");
            setTodoDone(todo["id"], false);
        }
    });
    card.addEventListener("mouseenter", function () {
        if (!text_input.classList.contains("has-focus")) {
            btn_delete.style.display = "block";
            date.style.display = "none";
        }
    });
    card.addEventListener("mouseleave", function () {
        if (!text_input.classList.contains("has-focus")) {
            btn_delete.style.display = "none";
            date.style.display = "block";
        }
    });
    card.appendChild(card_body);
    card_body.appendChild(leading);
    card_body.appendChild(title);
    card_body.appendChild(tralling);
    return card;
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
function deleteTodo(id) {
    new TodoLocalStorage().deleteById(id);
    render();
}
var Todo = (function () {
    function Todo(id, text, done, createdAt) {
        if (id === void 0) { id = 0; }
        if (done === void 0) { done = false; }
        this.id = id;
        this.text = text;
        this.done = done;
        this.createdAt = createdAt;
    }
    return Todo;
}());
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
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
function strDate(date) {
    var now = new Date();
    if (date.getFullYear() != now.getFullYear()) {
        return "".concat(months[date.getMonth()], " ").concat(date.getDate(), ", ").concat(date.getFullYear());
    }
    if (date.getMonth() != now.getMonth()) {
        return "".concat(months[date.getMonth()], " ").concat(date.getDate());
    }
    if (date.getDate() == now.getDate()) {
        var differece = now.getTime() - date.getTime();
        if (differece >= 0 && differece <= 60000) {
            return "Just now";
        }
        else {
            return "".concat(date.getHours(), "h:").concat(("00" + date.getMinutes()).slice(-2));
        }
    }
    else if (date.getDate() == now.getDate() - 1) {
        return "Yesteday";
    }
    else {
        return "".concat(months[date.getMonth()], " ").concat(date.getDate());
    }
}
