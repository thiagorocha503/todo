import { Component } from "react";
type Props = typeof OutlineButton.defaultProps & {
    value: string;
    onclick?: Function;
    color?: "primary" | "danger" | "info" | "secondary";
};
export default class OutlineButton extends Component<Props> {
    static defaultProps = {
        color: "primary",
    };

    render() {
        return (
            <button
                className={`btn btn-outline-${this.props.color}`}         
               
                onClick={() => this.props.onclick?.()}
            >
                {this.props.value}
            </button>
        );
    }
}
