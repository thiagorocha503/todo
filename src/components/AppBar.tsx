
import React, { Component } from "react";
import Container from "./Container";

type Props = {
    children: React.ReactNode
};

export default class Appbar extends Component<Props> {
    render(): React.ReactNode {
        return (
            <div className="navbar navbar-dark bg-primary sticky-top">
                <Container>{this.props.children}</Container>
            </div>
        );
    }
}
