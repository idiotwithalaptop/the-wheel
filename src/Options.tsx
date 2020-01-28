import React from "react";
import { AppOptions, AppOption } from './AppOption';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPowerOff, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons'

import './Options.css'

type OptionsState = {
    options: AppOptions
}

type OptionsProps = {
    resultCallback: (result: AppOptions) => void,
    initialOptions: AppOptions
}

export class Options extends React.Component<OptionsProps, OptionsState> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {
            options: props.initialOptions
        };
    }

    public static defaultProps: Partial<OptionsProps> = {
        initialOptions: AppOptions.create()
    }

    handleOptionChange(idx: number, optionValue: string) {
        const newOptions = this.state.options.updateOption(idx, optionValue);

        this.setState({ options: newOptions });
        this.props.resultCallback(newOptions);
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

    private enableButtonClassName(option : AppOption) : string {
        let result = "btn enabler";
        if(option.isEnabled) {
            result = result + " enabled";
        }
        return result;
    }

    render() {
        let optionRender = this.state.options.getAll().map((option, idx) => (
            <div className="option input-group mb-3">
                <input className="form-control" type="text" placeholder={`Option #${idx + 1}`} value={option.value} onChange={(e) => this.handleOptionChange(idx, e.target.value)} />
                <div className="input-group-append">
                    <div onClick={(e) => this.handleToggleEnabled(idx)}   className={this.enableButtonClassName(option)} title={option.isEnabled ? "enabled" : "disabled"}>
                        <FontAwesomeIcon icon={faPowerOff} />
                    </div>
                    <div className="btn red" title="remove"  onClick={(e) => this.handleRemoveOption(idx)} >
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </div>
                </div>
            </div>
        ))
        return <div>
            {optionRender}
            <div className="btn float-right" title="Add Option" onClick={(e) => this.handleAddOption()}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </div>
    }
}