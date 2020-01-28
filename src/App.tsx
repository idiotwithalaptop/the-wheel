import React from 'react';
import ReactModal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faEdit, faSplotch } from '@fortawesome/free-solid-svg-icons'
import { IStateSaver } from './IStateSaver'
import LocalStateSaver from './LocalStateSaver'
import { AppOptions } from "./AppOption"
import './App.css';
import { Wheel } from './Wheel';
import { Options } from './Options';

type AppState = {
  options: AppOptions,
  showModal: boolean,
  result: string
}

export class App extends React.Component<any, AppState> {
  private _stateSaver : IStateSaver;

  constructor(props: any) {
    super(props);
    this.state = {
      options: AppOptions.create(),
      showModal: false,
      result: ""
    }
    this._stateSaver = new LocalStateSaver();
  }

  componentDidMount() {
    this._stateSaver.load()
      .then((savedState) => {
        this.setState({options: savedState.options});
      });
  }

  componentDidUpdate() {
    const stateToSave = this.state.options;
    this._stateSaver.save({options: stateToSave});
  }

  private onResult(result: string) {
    this.setState({
      result: result,
      options: this.state.options.disableOption(result)
    });
  };

  private onShowModal() {
    this.setState({showModal: true});   
  };

  private onHideModal() {
    this.setState({showModal: false});
  };

  private onOptionsUpdated(newOptions : AppOptions) {
    this.setState({options: newOptions});
  }

  private onHideResult() {
    this.setState({result: ""});
  }

  render() {
    return <div>
      <Wheel options={this.state.options.getEnabledOptions()} resultCallback={(e) => this.onResult(e)} />
      <ReactModal isOpen={this.state.showModal} className="option-modal" closeTimeoutMS={250}>
        <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => this.onHideModal()} className="close-btn"/>
        <Options initialOptions={this.state.options} resultCallback={(e) => this.onOptionsUpdated(e)} />
      </ReactModal>
      <div onClick={(e) => this.onShowModal()} className="btn edit-btn">
        <FontAwesomeIcon icon={faEdit} className="btn icon"/>
      </div>
      <ReactModal isOpen={this.state.result !== ""} className="result-modal" closeTimeoutMS={250}>
        <FontAwesomeIcon icon={faTimesCircle} onClick={(e) => this.onHideResult()} className="close-btn"/>
        <h1>
          <FontAwesomeIcon icon={faSplotch} />{this.state.result}<FontAwesomeIcon icon={faSplotch} />
        </h1>
      </ReactModal>
    </div>
  }
}

export default App;
