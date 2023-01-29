import React from "react";
import Form from "./components/Form";
import OutlineButton from "./components/OutlineButton";
import TextField from "./components/TextField";
import FlatButton from "./components/FlatButton";
import InputGroup from "./components/InputGroup";
import Brand from "./components/Brand";
import { Todo } from "./model/Todo";
import TodoLocalStorage from "./db/TodoLocalStorage";
import List from "./components/List";
import Appbar from "./components/AppBar";

type Props = {};
type State = { showError: boolean; text: string; todos: Todo[] };

class App extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showError: false,
            text: "",
            todos: [],
        };
    }

    override componentDidMount(): void {
        this.setState({
            todos: new TodoLocalStorage().fetchAll(),
        });
    }

    handlerChangeText(text: string) {
        this.setState({ text });
    }

    handlerAddTodo() {
        if (this.state.text !== "") {
            const todo: Todo = new Todo(this.state.text, false, new Date());
            const db: TodoLocalStorage = new TodoLocalStorage();
            db.add(todo);
            const todos: Todo[] = db.fetchAll();
            this.setState({
                text: "",
                todos: todos,
                showError: false,
            });
        } else {
            this.setState({
                showError: true,
            });
        }
    }

    handlerClear() {
        const db = new TodoLocalStorage();
        db.clear();
        const todos = db.fetchAll();
        this.setState({
            todos,
        });
    }

    render(): React.ReactNode {
        return (
            <div className="App">
                <Appbar>
                    <Brand href="/">To do</Brand>
                </Appbar>
                <div className="container p-1 pt-4">
                    <div className="row pb-2">
                        <div className="col-12">
                            <Form>
                                <InputGroup>
                                    <TextField
                                        isValid={!this.state.showError}
                                        value={this.state.text}
                                        onChange={(value: string) => {
                                            return this.handlerChangeText(
                                                value
                                            );
                                        }}
                                        placeholder="Enter to do"
                                        onSubmit={() => this.handlerAddTodo()}
                                    />
                                    <FlatButton
                                        value="Add"
                                        onclick={() => this.handlerAddTodo()}
                                    />
                                </InputGroup>
                                {this.state.showError && (
                                    <div className="invalid-feedback d-block">
                                        Please fill out this field
                                    </div>
                                )}
                            </Form>
                        </div>
                    </div>
                    <div className="row pb-2">
                        <div className="col-12">
                            <List
                                todos={this.state.todos}
                                onChange={(todos: Todo[]) =>
                                    this.setState({ todos })
                                }
                            />
                        </div>
                    </div>
                    {this.state.todos.length > 0 && (
                        <div className="row my-2 text-center">
                            <div className="col-12">
                                <OutlineButton
                                    
                                    value="Clear"
                                    onclick={() => this.handlerClear()}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default App;
