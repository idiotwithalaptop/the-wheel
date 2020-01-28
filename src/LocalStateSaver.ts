import {IStateSaver, ApplicationState} from './IStateSaver';
import { AppOptions } from './AppOption'

export default class LocalStateSaver implements IStateSaver {
    async save(appState : ApplicationState): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(window.localStorage === undefined) {
                reject();
            }
            window.localStorage.setItem("rb_wheel", JSON.stringify(appState));
            resolve();
        });
        
    }

    async load(): Promise<ApplicationState> {
        return new Promise<ApplicationState>((resolve, reject) => {
            if(window.localStorage === undefined) {
                reject();
            }
            const loadedVal = window.localStorage.getItem("rb_wheel");
            if(loadedVal == null) {
                resolve({options: AppOptions.create()});
            }
            else {
                resolve({options: AppOptions.fromJSON(loadedVal)});
            }
        });
    }
}