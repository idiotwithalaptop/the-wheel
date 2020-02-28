import React, { CSSProperties } from "react";
import { AppOption } from './AppOption';
import { ColourPicker } from './ColourPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faTrashAlt, faPalette } from '@fortawesome/free-solid-svg-icons'

import './Option.css'

type OptionsState = {
    option: AppOption,
    hideColorPicker: boolean
}

type OptionsProps = {
    option: AppOption,
    idx: number,
    removeCallback: (idx : number) => void,
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

    private handleColourChange(idx: number, colourHex: string) {
        this.updateOption(option => {
            option.bgColour = colourHex;
            option.fgColour = this.getContrastColour(colourHex);
        })
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
    }

    private getContrastColour(hexcolor : string) : string {
        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }
    
        // If a three-character hexcode, make six-character
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }
    
        // Convert to RGB value
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
    
        // Get YIQ ratio
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
        // Check contrast
        return (yiq >= 128) ? '#000000' : '#ffffff';
    
    };

    private handleClickColour() {
        var newHide = !this.state.hideColorPicker;
        this.setState({
            hideColorPicker: newHide
        })
    }

    private enableButtonClassName(option : AppOption) : string {
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
        } as CSSProperties
        return <div className="option">
                <div className="input-group mb-3">
                <input className="form-control" type="text" placeholder={`Option #${this.props.idx + 1}`} value={this.state.option.value} onChange={(e) => this.handleOptionChange(e.target.value)} />
                <div className="input-group-append">
                    <div onClick={(e) => this.handleToggleEnabled()} className={this.enableButtonClassName(this.state.option)} title={this.state.option.isEnabled ? "Enabled" : "Disabled"}>
                        <FontAwesomeIcon icon={faPowerOff} />
                    </div>
                    <div className="btn red" title="Remove" onClick={(e) => this.props.removeCallback(this.props.idx)} >
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </div>

                    <ColourPicker hidden={this.state.hideColorPicker} currentColor={this.state.option.bgColour} resultCallback={(result) => this.handleColourChange(this.props.idx, result)} />
                    <div className="btn" title="Choose Colour" onClick={(e) => this.handleClickColour()} style={btnStyle}>
                        <FontAwesomeIcon icon={faPalette} />
                    </div>
                </div>
                </div>
            </div>
    }
}