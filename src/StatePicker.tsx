import React from "react";
import { UserState, AppOptionEntry } from './UserState'
import { AppOptions } from "./AppOption";

type StatePickerProps = {
    userState: UserState,
    resultCallback: (result: AppOptionEntry) => void,
}

type StatePickState = {
    newOption: AppOptionEntry
}

export class StatePicker extends React.Component<StatePickerProps, StatePickState> {
    constructor(props : StatePickerProps) {
        super(props);
        this.state = {
            newOption: {
                name: "",
                options: AppOptions.create()
            }
        };
    }

    private handleClick(options : AppOptionEntry) {
        this.props.resultCallback(options);
    }

    private handleAdd() {
        this.props.userState.entries.set(this.state.newOption.name, this.state.newOption)
        this.setState({
            newOption: {
                name: "",
                options: AppOptions.create()
            }
        });
    }

    private handleChange(val : string) {
        this.setState({
            newOption: {
                name: val,
                options: AppOptions.create()
            }
        });
    }


    render() {
        let entries = Array.from(this.props.userState.entries.keys()).map(key => {
            const entry = this.props.userState.entries.get(key);
            if (entry === undefined) {
                return (<div key={key.toString()}></div>)
            } else {
                return (<div key={key.toString()}>
                    <h2><button onClick={(e) => this.handleClick(entry)}>{entry.name}</button></h2>
                </div>);
            }
        });
                  
        return (
            <div>
                <h1>Existing Wheels</h1>
                <div>{entries}</div>
                <h1>New Wheel</h1>
                <div className="input-group mb-3">
                    <input className="form-control" type="text" placeholder="Wheel Name" value={this.state.newOption.name} onChange={(e) => this.handleChange(e.target.value)} />
                    <button className="btn" onClick={(e) => this.handleAdd()}>Add</button>    
                </div>
            </div>
        )
    }
}

export default StatePicker;