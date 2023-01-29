import React, { Component } from "react";
type Props = {
    children: React.ReactNode;
};
class InputGroup extends Component<Props> {
    render() {
        return <div className="input-group">{this.props.children}</div>;
    }
}

export default InputGroup;
