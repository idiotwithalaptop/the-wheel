import React from "react";
import { SketchPicker as Picker, ColorResult } from "react-color";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import "./ColourPicker.css"

type ColourPickerState = {
    color: string
}

type ColourPickerProps = {
    currentColor: string,
    hidden: boolean,
    resultCallback: (result: string) => void,
}

export class ColourPicker extends React.Component<ColourPickerProps, ColourPickerState> {
    constructor(props : ColourPickerProps) {
        super(props);
        this.state = {
            color: props.currentColor
        }
    }

    handleColorChange = (result : ColorResult) => {
        this.setState({
            color: result.hex
        });
    };

    handleClose = () => {
        this.props.resultCallback(this.state.color);
    };

    render() {        
          return (
            <div>
              { !this.props.hidden && ( <div className="cp_wrapper">  
                <FontAwesomeIcon icon={faTimesCircle} onClick={() => this.handleClose()} className="close-btn"/>
                <Picker 
                    color={this.state.color}
                    onChangeComplete={ this.handleColorChange }
                    disableAlpha={true} />
                </div> ) }
            </div>
          )
    }
}
