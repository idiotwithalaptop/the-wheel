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

    private handleOptionChange(idx: number, optionValue: AppOption) {
        this.props.resultCallback(this.state.options);
    };

    private handleAddOption = () => {
        const newOptions = this.state.options.addOption("");
        this.setState({
            options: newOptions
        });
        this.props.resultCallback(newOptions);
    };

    private handleRemoveOption(idx: number) {
        const newOptions = this.state.options.removeOption(idx);
        this.setState({
            options: newOptions
        });
        this.props.resultCallback(newOptions);
    };

    render() {
        let optionRender = this.state.options.getAll().map((option, idx) => (
            <Option removeCallback={(index) => this.handleRemoveOption(index)} optionChangeCallback={(changedOption) => this.handleOptionChange(idx, changedOption)} idx={idx} option={option} key={idx}/>
        ))
        return <div>
            {optionRender}
            <div className="btn float-right" title="Add Option" onClick={(e) => this.handleAddOption()}>
                <FontAwesomeIcon icon={faPlus} />
            </div>
        </div>
    }
}