import { Component } from "react";
type Props = {
    children: React.ReactNode;
    background?: string
};
export default class Card extends Component<Props> {
    
    render() {
        return (
            <div style={{background: this.props.background}} className="card p-1 m-1">
                <div className="d-flex align-items-center">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
