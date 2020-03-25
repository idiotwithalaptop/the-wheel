import React from 'react';
import ReactModal from "react-modal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle, faEdit, faSplotch } from '@fortawesome/free-solid-svg-icons'
import { AppOptions } from "./AppOption"
import './App.css';
import { Wheel } from './Wheel';
import { Options } from './Options';

ReactModal.setAppElement("#root");

type DeciderState = {
  options: AppOptions,
  showModal: boolean,
  result: string
}

type DeciderProps = {
    options: AppOptions,
    name: string,
    saveCallback: (options: AppOptions) => void
}

export class Decider extends React.Component<DeciderProps, DeciderState> {
  constructor(props: DeciderProps) {
    super(props);
    this.state = {
      options: props.options,
      showModal: false,
      result: ""
    };
  }

  private updateOptions(callback : (options : AppOptions) => AppOptions) {
    let newOptions = callback(this.state.options);
    this.setState({
      options: newOptions
    });
    this.props.saveCallback(newOptions);
  }

  private onResult(result: string) {
    this.updateOptions(options => {
      return options.disableOption(result)
    });
    this.setState({
      result: result
    });
  };

  private onShowModal() {
    this.setState({showModal: true});   
  };

  private onHideModal() {
    this.setState({showModal: false});
  };

  private onOptionsUpdated(newOptions : AppOptions) {
    this.updateOptions(() => {
      return newOptions;
    });
  }

  private onHideResult() {
    this.setState({result: ""});
  }

  render() {
    return <div className="container">
      <div className="text-center col-12"><h1>{this.props.name}</h1></div>
      <Wheel options={this.state.options} resultCallback={(e) => this.onResult(e)} />
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

export default Decider;
