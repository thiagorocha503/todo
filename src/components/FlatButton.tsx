import { Component, MouseEventHandler } from "react";

type Props = typeof FlatButton.defaultProps & {
    value: string;
    onclick: Function;
    color?: "primary" | "danger" | "info" | "secondary";
};
class FlatButton extends Component<Props> {
    static defaultProps = {
        color: "primary",
    };

    render() {
        return (
            <button
                className={`btn btn-${this.props.color}`}
                onClick={() => {
                    this.props.onclick();
                }}
                type="button"
            >
                {this.props.value}
            </button>
        );
    }
}

export default FlatButton;
