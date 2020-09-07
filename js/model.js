"use strict";
//------------ Model -----------------------------
var Todo = /** @class */ (function () {
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
