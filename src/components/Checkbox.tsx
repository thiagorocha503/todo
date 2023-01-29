import { Component } from "react";

type Props = {
    checked: boolean;
    onChange: Function;
};

export default class Checkbox extends Component<Props> {

    handerChange =()=>{
        this.props.onChange(!this.props.checked)
    }
    render(): JSX.Element {
        return (
            <input
                className="form-check-input position-static"
                type="checkbox"
                checked={this.props.checked}
                onChange={this.handerChange}
            />
        );
    }
}
