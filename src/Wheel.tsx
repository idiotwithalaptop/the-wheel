import React from 'react';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons'
import './Wheel.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type WheelProps = {
    options: string[],
    resultCallback: (result: string) => void,
    width: number,
    height: number,
    insideRadius: number,
    outsideRadius: number,
    textRadius: number,
    spinVelocity: number,
    colors: WheelColor[]
}

type WheelState = {
    startAngle: number,
    isSpinning: boolean,
    spinTimeout: number,
    result: string
}

type WheelColor = {
    bgColor: string,
    fgColor: string
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
        width: 600,
        height: 600,
        insideRadius: 150,
        outsideRadius: 250,
        textRadius: 194,
        spinVelocity: 2000,
        colors: [
            { bgColor: "#F80120", fgColor: "#FFF" },
            { bgColor: "#F35B20", fgColor: "#FFF" },
            { bgColor: "#FB9A00", fgColor: "#333" },
            { bgColor: "#FFCC00", fgColor: "#333" },
            { bgColor: "#FEF200", fgColor: "#333" },
            { bgColor: "#B8D430", fgColor: "#333" },
            { bgColor: "#3AB745", fgColor: "#FFF" },
            { bgColor: "#029990", fgColor: "#FFF" },
            { bgColor: "#3501CB", fgColor: "#FFF" },
            { bgColor: "#2E2C75", fgColor: "#FFF" },
            { bgColor: "#673A7E", fgColor: "#FFF" },
            { bgColor: "#CC0071", fgColor: "#FFF" }
        ]
    };

    componentDidMount() {
        this.doInCanvas(ctx => {
            ctx.clearRect(0, 0, this.props.width, this.props.height);
            ctx.strokeStyle = "black";
            ctx.font = "bold 14px Helvetica, Arial";
        });
        this.draw();
    }

    componentDidUpdate() {
        this.draw();
    }

    draw() {
        this.doInCanvas(ctx => {
            
            const insideRadius = this.props.insideRadius;
            const outsideRadius = this.props.outsideRadius;
            const textRadius = this.props.textRadius;
            const startAngle = this.state.startAngle;
            const height = this.props.height;
            const width = this.props.width;
            const options = this.props.options;
            const arc = this.calculateArc();
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < options.length; i++) {
                const option = options[i];
                const angle = startAngle + i * arc;    
                const color = this.getColor(i);
                ctx.fillStyle = color.bgColor;

                /* Render Segment */
                ctx.beginPath();
                ctx.arc(width / 2, height / 2, outsideRadius, angle, angle + arc, false);
                ctx.arc(width / 2, height / 2, insideRadius, angle + arc, angle, true);
                ctx.fill();
                ctx.save();
                
                /* Render Text */
                ctx.fillStyle = color.fgColor;
                ctx.translate(width / 2 + Math.cos(angle + arc / 2) * textRadius,
                    height / 2 + Math.sin(angle + arc / 2) * textRadius);
                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                this.printName(option, -ctx.measureText(option).width / 2, 0, 14, ((2 * Math.PI * textRadius) / options.length) - 10);
                ctx.restore();
            }
            this.drawArrow(ctx);
        });
    };

    private getColor(i : number) : WheelColor {
        if(i >= this.props.colors.length) {
            return this.getColor(i - this.props.colors.length);
        }
        return this.props.colors[i];
    }

    private calculateArc() : number {
        return Math.PI / (this.props.options.length / 2);
    }

    private drawArrow(ctx : CanvasRenderingContext2D) {
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.moveTo(this.props.width / 2 - 4, this.props.height / 2 - (this.props.outsideRadius + 25));
        ctx.lineTo(this.props.width / 2 + 4, this.props.height / 2 - (this.props.outsideRadius + 25));
        ctx.lineTo(this.props.width / 2 + 4, this.props.height / 2 - (this.props.outsideRadius + 15));
        ctx.lineTo(this.props.width / 2 + 9, this.props.height / 2 - (this.props.outsideRadius + 15));
        ctx.lineTo(this.props.width / 2 + 0, this.props.height / 2 - (this.props.outsideRadius - 0));
        ctx.lineTo(this.props.width / 2 - 9, this.props.height / 2 - (this.props.outsideRadius + 15));
        ctx.lineTo(this.props.width / 2 - 4, this.props.height / 2 - (this.props.outsideRadius + 15));
        ctx.lineTo(this.props.width / 2 - 4, this.props.height / 2 - (this.props.outsideRadius + 25));
        ctx.fill();
    };

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
        var spinAngle = spinAngleStart - this.easeOut(newSpinTime, 0, spinAngleStart, spinTimeTotal);
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

            const result = this.props.options[index];
            this.setState({ result: result });
            this.props.resultCallback(result);
            ctx.restore();
        });
    };

    printName(text: string, x: number, y: number, lineHeight: number, fitWidth: number) {
        var str, splitDash, headText, tailText, idx;
        fitWidth = fitWidth || 0;
        this.doInCanvas(ctx => {
            if (fitWidth <= 0) {
                ctx.fillText(text, x, y);
                return;
            }

            for (idx = 1; idx <= text.length; idx++) {
                str = text.substr(0, idx);

                if (ctx.measureText(str).width > fitWidth) {
                    splitDash = (text.charAt(idx - 2) !== " ") ? "-" : "";
                    headText = text.substr(0, idx - 1) + splitDash;
                    tailText = text.substr(idx - 1);
                    ctx.fillText(headText, -ctx.measureText(headText).width / 2, y - lineHeight);
                    this.printName(tailText, -ctx.measureText(tailText).width / 2, y + lineHeight, lineHeight, fitWidth - 10);
                    return;
                }
            }

            ctx.fillText(text, x, (y ? y - lineHeight : y));
        });
    };

    easeOut(t: number, b: number, c: number, d: number) {
        var ts = (t /= d) * t;
        var tc = ts * t;

        return b + c * (tc + -3 * ts + 3 * t);
    };

    private handleClick(event : React.MouseEvent<HTMLElement>) {
        console.log("WHEEE!!!");
        this.spin(true);
    }

    render() {
        return  <div className="hcenter-wrapper">
                    <div>
                        <canvas ref={this.ctxRef} width={this.props.width} height={this.props.height}></canvas>
                    </div>
                    <button className="btn" onClick={(e) => this.handleClick(e)}>
                        <FontAwesomeIcon icon={faRedoAlt} /> Spin!
                    </button>
                </div>
    }

    private doInCanvas(action: (canvasContext : CanvasRenderingContext2D) => void) : void {
        if(this.ctxRef.current !== null) {
            action(this.ctxRef.current.getContext('2d') as CanvasRenderingContext2D);
        }
    }
}
