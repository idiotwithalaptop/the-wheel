import React from 'react';
import Decider from './Decider'
import LocalStateSaver from './LocalStateSaver'
import {IStateSaver} from './IStateSaver'
import { AppOptions } from './AppOption';
import { UserState, AppOptionEntry } from './UserState';
import StatePicker from './StatePicker';

type AppState = {
  userState: UserState,
  currentOptions: AppOptionEntry | null
}

export class App extends React.Component<any, AppState> {
  private _stateSaver : IStateSaver;

  constructor(props: any) {
    super(props);
    this._stateSaver = new LocalStateSaver();
    this.state = {
      userState: {entries: new Map<String, AppOptionEntry>()},
      currentOptions: null
    };
  }

  componentDidMount() {
    this._stateSaver.load()
      .then((savedState) => {
        this.setState({userState: savedState});
      });
  }

  componentDidUpdate() {
    this._stateSaver.save(this.state.userState);
  }

  private handleStateSelected(option : AppOptionEntry) {
    this.setState({
      currentOptions: option
    });
  }

  private saveOptions(options : AppOptions ) {
    if(this.state.currentOptions !== null) {
      const userState = this.state.userState;
      const currentOptions = {name: this.state.currentOptions.name, options};
      userState.entries.set(this.state.currentOptions.name, currentOptions);
      this.setState({
        userState
      });
      this._stateSaver.save(userState);
    }
  }

  render() {
    const body = this.state.currentOptions === null ? 
      <StatePicker userState={this.state.userState} resultCallback={(e) => this.handleStateSelected(e)} /> :
      <Decider options={this.state.currentOptions.options} saveCallback={(e) => this.saveOptions(e)}  name={this.state.currentOptions.name}/>;
    return <div>
      {body}
    </div>
  }
}

export default App;
