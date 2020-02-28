import React from "react";
import { AppOptions, AppOption } from './AppOption';
import { Option } from "./Option";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

import './Options.css'

type OptionsState = {
    options: AppOptions,
    hideColorPicker: boolean
}

type OptionsProps = {
    resultCallback: (result: AppOptions) => void,
    initialOptions: AppOptions
}

export class Options extends React.Component<OptionsProps, OptionsState> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {
            options: props.initialOptions,
            hideColorPicker: true
        };
    }

    public static defaultProps: Partial<OptionsProps> = {
        initialOptions: AppOptions.create()
    }

    handleOptionChange(idx: number, optionValue: string) {
        this.props.resultCallback(this.state.options);
    };

    handleAddOption = () => {
        const newOptions = this.state.options.addOption("");
        this.setState({
            options: newOptions
        });
        this.props.resultCallback(newOptions);
    };

    handleRemoveOption(idx: number) {
        const newOptions = this.state.options.removeOption(idx);
        this.setState({
            options: newOptions
        });
        this.props.resultCallback(newOptions);
    };

    handleToggleEnabled(idx: number) {
        const newOptions = this.state.options.toggleEnabled(idx);
        this.setState({
            options: newOptions
        });
        this.props.resultCallback(newOptions);
    };

    handleColourChange(idx: number, colourHex: string) {
        this.setState({
            hideColorPicker: true
        });
        this.props.resultCallback(this.state.options);
    }

    handleClickColour() {
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
        let optionRender = this.state.options.getAll().map((option, idx) => (
            // <div className="option input-group mb-3">
            //     <input className="form-control" type="text" placeholder={`Option #${idx + 1}`} value={option.value} onChange={(e) => this.handleOptionChange(idx, e.target.value)} />
            //     <div className="input-group-append">
            //         <div onClick={(e) => this.handleToggleEnabled(idx)} className={this.enableButtonClassName(option)} title={option.isEnabled ? "Enabled" : "Disabled"}>
            //             <FontAwesomeIcon icon={faPowerOff} />
            //         </div>
            //         <div className="btn red" title="Remove" onClick={(e) => this.handleRemoveOption(idx)} >
            //             <FontAwesomeIcon icon={faTrashAlt}/>
            //         </div>
            //         <div className="btn" title="Choose Colour" onClick={(e) => this.handleClickColour()}>
            //             <FontAwesomeIcon icon={faPalette} />
            //             <ColourPicker hidden={this.state.hideColorPicker} currentColor={option.bgColour} resultCallback={(result) => this.handleColourChange(idx, result)} />
            //         </div>
            //     </div>
            // </div>
            <Option removeCallback={(index) => this.handleRemoveOption(index)} idx={idx} option={option} key={idx}/>
        ))
        return <div>
            {optionRender}
            <div className="btn float-right" title="Add Option" onClick={(e) => this.handleAddOption()}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </div>
    }
}