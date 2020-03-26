import React, { CSSProperties } from "react";
import { AppOption } from './AppOption';
import { ColourPicker } from './ColourPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faTrashAlt, faPalette } from '@fortawesome/free-solid-svg-icons'

import './Option.css'
import ColourUtils from "./ColourUtils";

type OptionsState = {
    option: AppOption,
    hideColorPicker: boolean
}

type OptionsProps = {
    option: AppOption,
    idx: number,
    removeCallback: (idx : number) => void,
    optionChangeCallback: (option: AppOption) => void,
}

export class Option extends React.Component<OptionsProps, OptionsState> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {
            option: this.props.option,
            hideColorPicker: true
        };
    }

    private handleOptionChange(optionValue: string) {
        this.updateOption(option => option.value = optionValue);
    };

    private handleToggleEnabled() {
        this.updateOption(option => option.isEnabled = !option.isEnabled);
    };

    private handleColourChange(colourHex: string) {
        this.updateOption(option => {
            option.bgColour = colourHex;
            option.fgColour = ColourUtils.getContrastColour(colourHex);
        });
        this.setState({
            hideColorPicker: true
        });
    }

    private updateOption(callback: (option : AppOption) => void) {
        const option = this.state.option;
        callback(option);
        this.setState({
            option: option
        });
        this.props.optionChangeCallback(option);
    }

    private handleClickColour() {
        const newHide = !this.state.hideColorPicker;
        this.setState({
            hideColorPicker: newHide
        })
    }

    private static enableButtonClassName(option : AppOption) : string {
        let result = "btn enabler";
        if(option.isEnabled) {
            result = result + " enabled";
        }
        return result;
    }

    render() {
        let btnStyle = {
            backgroundColor: this.state.option.bgColour,
            color: this.state.option.fgColour
        } as CSSProperties;
        return <div className="option">
                <div className="input-group mb-3">
                    <input className="form-control" type="text" placeholder={`Option #${this.props.idx + 1}`} value={this.state.option.value} onChange={(e) => this.handleOptionChange(e.target.value)} />
                    <div className="input-group-append">
                        <div onClick={() => this.handleToggleEnabled()} className={Option.enableButtonClassName(this.state.option)} title={this.state.option.isEnabled ? "Enabled" : "Disabled"}>
                            <FontAwesomeIcon icon={faPowerOff} />
                        </div>
                        <div className="btn btn-primary red" title="Remove" onClick={() => this.props.removeCallback(this.props.idx)} >
                            <FontAwesomeIcon icon={faTrashAlt}/>
                        </div>

                        <ColourPicker hidden={this.state.hideColorPicker} currentColor={this.state.option.bgColour} resultCallback={(result) => this.handleColourChange(result)} />
                        <div className="btn" title="Choose Colour" onClick={() => this.handleClickColour()} style={btnStyle}>
                            <FontAwesomeIcon icon={faPalette} />
                        </div>
                    </div>
                </div>
            </div>
    }
}