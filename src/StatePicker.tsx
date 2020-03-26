import React from "react";
import { UserState, AppOptionEntry } from './UserState'
import { AppOptions } from "./AppOption";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";

type StatePickerProps = {
    userState: UserState,
    resultCallback: (result: AppOptionEntry | null) => void,
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
        this.props.userState.entries.set(this.state.newOption.name, this.state.newOption);
        this.setState({
            newOption: {
                name: "",
                options: AppOptions.create()
            }
        });
        this.props.resultCallback(null);
    }

    private handleRemove(key : string) {
        this.props.userState.entries.delete(key);
        this.setState({
            newOption: {
                name: "",
                options: AppOptions.create()
            }
        });
        this.props.resultCallback(null);
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
                return (<li key={key.toString()} />)
            } else {
                return (<li key={key.toString()}>
                    <button className="btn btn-link" onClick={() => this.handleClick(entry)}>{entry.name}</button>
                    <button className="btn btn-primary red" title="Remove" onClick={() => this.handleRemove(key)} >
                        <FontAwesomeIcon icon={faTrashAlt}/>
                    </button>
                </li>);
            }
        });
                  
        return (
            <div className="container">
                <h1>Welcome to the Wheel!!!!</h1>
                <p>Please choose an existing wheel</p>
                <ul className="no-bullets">{entries}</ul>
                <p>Or, create a new wheel</p>
                <div className="col-12 col-md-6">
                <div className="input-group mb-3">
                    <input className="form-control" type="text" placeholder="Wheel Name" value={this.state.newOption.name} onChange={(e) => this.handleChange(e.target.value)} />
                    <div className="input-group-append">
                        <button className="btn btn-primary" onClick={() => this.handleAdd()}>Add</button>
                    </div>
                </div>
                </div>
            </div>
        )
    }
}

export default StatePicker;