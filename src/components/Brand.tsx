import React, { Component } from "react";

type Props = {
    href: string;
    children: React.ReactNode;
};
export default class Brand extends Component<Props> {
    render() {
        return (
            <a className="navbar-brand" href="/">
                {this.props.children}
            </a>
        );
    }
}
