export type AppOption = {
    value: string,
    isEnabled: boolean
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
        values.push({
            value,
            isEnabled: true
        });
        return new AppOptions(values);
    }

    updateOption(idx : number, newValue : string) {
        const newOptions = this._options.map((option: AppOption, sidx: number) => {
            if (idx === sidx) {
                option.value = newValue;
            }
            return option;
        });
        return new AppOptions(newOptions);
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

    enableOption(value : string) : AppOptions {
        const options = this._options.map(option => {
            if(option.value === value) {
                option.isEnabled = true;
            }
            return option;
        });
        return new AppOptions(options);
    }

    getEnabledOptions() : string[] {
        return this._options
            .filter(option => option.isEnabled)
            .map(option => option.value);
    }

    getAll() : AppOption[] {
        return this._options;
    }
}