export type AppOption = {
    value: string,
    isEnabled: boolean,
    bgColour: string,
    fgColour: string
};

export class AppOptions {
    private _options : AppOption[];
    private constructor(_options : AppOption[]) {
        this._options = _options;
    }   

    static create() : AppOptions {
        return new AppOptions([]);
    }

    static fromJSON(state : string) : AppOptions {
        const parsedValue = JSON.parse(state);
        return new AppOptions(parsedValue.options._options);
    }

    removeOption(index : number) : AppOptions {
        const newOptions = this._options.filter((option, idx) => { 
            return idx !== index 
        });
        return new AppOptions(newOptions); 
    }

    toggleEnabled(idx : number) : AppOptions {
        const newOptions = this._options.map((option: AppOption, sidx: number) => {
            if (idx === sidx) {
                option.isEnabled = !option.isEnabled;
            }
            return option;
        });
        return new AppOptions(newOptions);
    }

    addOption(value : string) : AppOptions {
        let values = this._options.slice(0);
        let colour = this.generateRandomColourHash();
        values.push({
            value,
            isEnabled: true,
            bgColour: colour,
            fgColour: this.getContrastColour(colour)
        });
        return new AppOptions(values);
    }

    disableOption(value : string) : AppOptions {
        const isReset = this.count(this._options, option => option.isEnabled) === 1;
        const options = this._options.map(option => {
            if(isReset) {
                option.isEnabled = true;
            }
            else if(option.value === value) {
                option.isEnabled = false;
            }
            return option;
        });
        return new AppOptions(options);
    }

    private count<T>(values: T[], callback: (value : T) => boolean) : number {
        let counter = 0;
        for (let index = 0; index < values.length; index++) {
            const element = values[index];
            if(callback(element) === true) {
                counter++;
            }
        }
        return counter;
    }

    getEnabledOptions() : AppOption[] {
        return this._options
            .filter(option => option.isEnabled);
    }

    getAll() : AppOption[] {
        return this._options;
    }

    private generateRandomColourHash() : string {
        return "#" + Math.floor(Math.random()*16777215).toString(16);
    }

    private getContrastColour(hexcolor : string) : string {
        // If a leading # is provided, remove it
        if (hexcolor.slice(0, 1) === '#') {
            hexcolor = hexcolor.slice(1);
        }
    
        // If a three-character hexcode, make six-character
        if (hexcolor.length === 3) {
            hexcolor = hexcolor.split('').map(function (hex) {
                return hex + hex;
            }).join('');
        }
    
        // Convert to RGB value
        var r = parseInt(hexcolor.substr(0,2),16);
        var g = parseInt(hexcolor.substr(2,2),16);
        var b = parseInt(hexcolor.substr(4,2),16);
    
        // Get YIQ ratio
        var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    
        // Check contrast
        return (yiq >= 128) ? 'black' : 'white';
    
    };
}