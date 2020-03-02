import React from 'react';
import Decider from './Decider'
import LocalStateSaver from './LocalStateSaver'
import {IStateSaver} from './IStateSaver'
import { AppOptions } from './AppOption';

type AppState = {
  currentOptions: AppOptions | null
}

export class App extends React.Component<any, AppState> {
  private _stateSaver : IStateSaver;

  constructor(props: any) {
    super(props);
    this._stateSaver = new LocalStateSaver();
    this.state = {
      currentOptions: null
    };
  }

  componentDidMount() {
    this._stateSaver.load()
      .then((savedState) => {
        this.setState({currentOptions: savedState.options});
      });
  }

  render() {
    const body = this.state.currentOptions === null ? 
      <h1>Loading ...</h1> :
      <Decider options={this.state.currentOptions} saver={this._stateSaver} />;

    return <div>
      {body}
    </div>
  }
}

export default App;
