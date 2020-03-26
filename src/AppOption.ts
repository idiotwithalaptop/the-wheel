import ColourUtils from "./ColourUtils";

export type AppOption = {
    value: string,
    isEnabled: boolean,
    bgColour: string,
    fgColour: string
};

export class AppOptions {
    private readonly _options : AppOption[];
    private constructor(_options : AppOption[]) {
        this._options = [..._options];
    }   

    static create() : AppOptions {
        return new AppOptions([]);
    }

    static fromObj(state : any) : AppOptions {
        if(state.options !== undefined) {
            return new AppOptions(state.options._options);
        }
        return this.create();
    }

    removeOption(index : number) : AppOptions {
        const newOptions = this._options.filter((option, idx) => { 
            return idx !== index 
        });
        return new AppOptions(newOptions); 
    }

    addOption(value : string) : AppOptions {
        let values = this._options.slice(0);
        let colour = ColourUtils.generateRandomColourHash();
        values.push({
            value,
            isEnabled: true,
            bgColour: colour,
            fgColour: ColourUtils.getContrastColour(colour)
        });
        return new AppOptions(values);
    }

    disableOption(value : string) : AppOptions {
        const isReset = AppOptions.count(this._options, option => option.isEnabled) === 1;
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

    private static count<T>(values: T[], callback: (value : T) => boolean) : number {
        let counter = 0;
        for (let index = 0; index < values.length; index++) {
            const element = values[index];
            if(callback(element)) {
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
}