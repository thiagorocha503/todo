import { Component } from "react";

type Props = {
    children: React.ReactNode;
};

class Form extends Component<Props> {
    
    render() {
        return <div className="mb-3 ">{this.props.children}</div>;
    }
}

export default Form;
