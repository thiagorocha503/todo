import { Component, Fragment } from "react";
import "./List.modules.css";
import TodoLocalStorage from "../db/TodoLocalStorage";
import { Todo } from "../model/Todo";
import Card from "./Card";
import Checkbox from "./Checkbox";
import DeleteIcon from "./DeleteIcon";

type Props = {
    todos: Todo[];
    onChange: Function;
};
class List extends Component<Props> {
    handlerOnChange(todo: Todo, value: boolean) {
        const db = new TodoLocalStorage();
        todo.done = value;
        db.update(todo);
        const todos = db.fetchAll();
        this.props.onChange(todos);
    }

    handerOnClick(todo: Todo) {
        const db = new TodoLocalStorage();
        db.deleteById(todo.id ?? 0);
        const todos = db.fetchAll();
        this.props.onChange(todos);
    }

    render() {
        return (
            <Fragment>
                {this.props.todos.map((todo: Todo) => (
                    <Card
                        key={todo.id}
                        background={todo.done ? " #E9E9E9" : ""}
                    >
                        <div className="px-2">
                            <Checkbox
                                onChange={(value: boolean) =>
                                    this.handlerOnChange(todo, value)
                                }
                                checked={todo.done}
                            />
                        </div>
                        <div className="px-2 flex-grow-1">
                            <p
                                className={`text-start ${
                                    todo.done ? "text-done" : ""
                                }`}
                            >
                                {todo.text} {todo.id}
                            </p>
                        </div>
                        <div className="px-2">
                            <button
                                className="btn text-primary"
                                onClick={() => this.handerOnClick(todo)}
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    </Card>
                ))}
            </Fragment>
        );
    }
}

export default List;
