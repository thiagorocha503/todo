import React, { Component } from "react";


type Props = typeof TextField.defaultProps & {
    value: string;
    placeholder?: string;
    onChange: Function;
    onSubmit?: Function;
    isValid: boolean
};
class TextField extends Component<Props, {}> {
    
    static defaultProps = {
        isValid: true,
    };
    handerKeyDown = (e: any) => {
        if (e.key === "Enter") {
            this.props.onSubmit?.();
        }
    };

    handlerOnChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
       this.props.onChange(e.target.value);
    }
    render() {
        return (
            <input
                type="text"
                className={`form-control ${!this.props.isValid?'is-invalid':''} `}
                placeholder="Enter to do"
                onChange={this.handlerOnChange}
                value={this.props.value}
                onKeyDown={this.handerKeyDown}
            />
        );
    }
}

export default TextField;
