import React from 'react';
import {faArrowDown, faRedoAlt} from '@fortawesome/free-solid-svg-icons'
import './Wheel.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {AppOptions} from './AppOption'

type WheelProps = {
    options: AppOptions,
    resultCallback: (result: string) => void,
    size: number,
    spinVelocity: number
}

type WheelState = {
    startAngle: number,
    isSpinning: boolean,
    spinTimeout: number,
    result: string
}

export class Wheel extends React.Component<WheelProps, WheelState> {
    private ctxRef = React.createRef<HTMLCanvasElement>();

    constructor(props: WheelProps) {
        super(props);
        this.state = {
            startAngle: 0,
            isSpinning: false,
            spinTimeout: 0,
            result: ""
        };
    }

    public static defaultProps: Partial<WheelProps> = {
        size: 600,
        spinVelocity: 2000
    };

    componentDidMount() {
        this.doInCanvas(ctx => {
            ctx.clearRect(0, 0, this.getSize(), this.getSize());
            ctx.strokeStyle = "black";
            ctx.font = "bold 14px Helvetica, Arial";
        });
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    private getSize() {
        return Math.min(window.innerHeight, window.innerWidth, this.props.size);
    }

    draw() {
        this.doInCanvas(ctx => {
            const startAngle = this.state.startAngle;
            const height = this.getSize();
            const width = this.getSize();
            const insideRadius = width / 3;
            const outsideRadius = width / 2;
            const textRadius = width * ( 5 / 12 );
            const options = this.props.options.getEnabledOptions();
            const arc = this.calculateArc();
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const angle = startAngle + i * arc;    
                ctx.fillStyle = option.bgColour;

                /* Render Segment */
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, outsideRadius, angle, angle + arc, false);
                ctx.arc(width / 2, height / 2, insideRadius, angle + arc, angle, true);
                ctx.fill();
                ctx.save();
                
                /* Render Text */
                ctx.fillStyle = option.fgColour;
                ctx.translate(width / 2 + Math.cos(angle + arc / 2) * textRadius,
                    height / 2 + Math.sin(angle + arc / 2) * textRadius);
                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                this.printName(option.value, -ctx.measureText(option.value).width / 2, 0, 14, ((2 * Math.PI * textRadius) / options.length) - 10);
                ctx.restore();
            }
        });
    };

    private calculateArc() : number {
        return Math.PI / (this.props.options.getEnabledOptions().length / 2);
    }

    spin(isForward: boolean) {
        this.setState({ result: ""});
        const spinTime = 0;
        const spinTimeTotal = Math.random() * 3 + 4 * this.props.spinVelocity;
        const spinAngleStart = Math.random() * 10 + 10;
        

        if (!this.state.isSpinning && isForward) {
            this.setState({ isSpinning: true });
            this.rotate(true, spinTime, spinTimeTotal, spinAngleStart);
        } else if (!this.state.isSpinning && !isForward) {
            this.setState({ isSpinning: true });
            this.rotate(false, spinTime, spinTimeTotal, spinAngleStart);
        }
    };

    rotate(isForward: boolean, spinTime : number, spinTimeTotal : number, spinAngleStart : number) {
        const newSpinTime = spinTime + 30;
        if (newSpinTime >= spinTimeTotal) {
            this.stopRotate();
            this.setState({
                isSpinning: false
            });
            return;
        }
        const spinAngle = spinAngleStart - this.easeOut(newSpinTime, 0, spinAngleStart, spinTimeTotal);
        if (isForward) {
            this.setState({ startAngle: this.state.startAngle + (spinAngle * Math.PI / 180) });
        } else {
            this.setState({ startAngle: this.state.startAngle - (spinAngle * Math.PI / 180) });
        }
        this.draw();
        const timeoutID = window.setTimeout(() => {
            this.rotate(isForward, newSpinTime, spinTimeTotal, spinAngleStart);
        }, 30);
        this.setState({ spinTimeout: timeoutID });
    };

    stopRotate() {
        clearTimeout(this.state.spinTimeout);
        let degrees = this.state.startAngle * 180 / Math.PI + 90;
        const arcd = this.calculateArc() * 180 / Math.PI;
        let index = Math.floor((360 - degrees % 360) / arcd);
        this.doInCanvas(ctx => {
            ctx.save();

            if (degrees < 0) {
                degrees = Math.abs(degrees);
                index = Math.floor((degrees % 360) / arcd);
            }

            const result = this.props.options.getEnabledOptions()[index];
            this.setState({ result: result.value });
            this.props.resultCallback(result.value);
            ctx.restore();
        });
    };

    printName(text: string, x: number, y: number, lineHeight: number, fitWidth: number) {
        const widthToFit = fitWidth || 0;
        this.doInCanvas(ctx => {
            if (widthToFit <= 0) {
                ctx.fillText(text, x, y);
                return;
            }

            for (let idx = 1; idx <= text.length; idx++) {
                let str = text.substr(0, idx);

                if (ctx.measureText(str).width > widthToFit) {
                    let splitDash = (text.charAt(idx - 2) !== " ") ? "-" : "";
                    let headText = text.substr(0, idx - 1) + splitDash;
                    let tailText = text.substr(idx - 1);
                    ctx.fillText(headText, -ctx.measureText(headText).width / 2, y - lineHeight);
                    this.printName(tailText, -ctx.measureText(tailText).width / 2, y + lineHeight, lineHeight, widthToFit - 10);
                    return;
                }
            }

            ctx.fillText(text, x, (y ? y - lineHeight : y));
        });
    };

    easeOut(t: number, b: number, c: number, d: number) {
        const ts = (t /= d) * t;
        const tc = ts * t;

        return b + c * (tc + -3 * ts + 3 * t);
    };

    private handleClick() {
        this.spin(true);
    }

    render() {
        return <div>
                <div className="col-12 text-center">
                    <FontAwesomeIcon icon={faArrowDown} />
                </div>
                <div className="hcenter-wrapper">
                    <div>
                        <canvas ref={this.ctxRef} width={this.getSize()} height={this.getSize()} />
                    </div>
                    <button className="btn btn-primary circular hcenter" onClick={() => this.handleClick()}>
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </button>
                </div>
            </div>
    }

    private doInCanvas(action: (canvasContext : CanvasRenderingContext2D) => void) : void {
        if(this.ctxRef.current !== null) {
            action(this.ctxRef.current.getContext('2d') as CanvasRenderingContext2D);
        }
    }
}
