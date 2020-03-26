import {IStateSaver} from './IStateSaver';
import { UserState, AppOptionEntry } from './UserState';
import { AppOptions } from './AppOption'

export default class LocalStateSaver implements IStateSaver {
    async save(appState : UserState): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if(window.localStorage === undefined) {
                reject();
            }
            window.localStorage.setItem("rb_wheel", JSON.stringify(Array.from(appState.entries.entries())));
            resolve();
        });
        
    }

    async load(): Promise<UserState> {
        return new Promise<UserState>((resolve, reject) => {
            if(window.localStorage === undefined) {
                reject();
            }
            const loadedVal = window.localStorage.getItem("rb_wheel");
            if(loadedVal == null) {
                resolve({entries: new Map<string, AppOptionEntry>()});
            }
            else {
                resolve({entries: LocalStateSaver.objToStrMap(loadedVal)});
            }
        });
    }

    private static objToStrMap(obj : any) : Map<string, AppOptionEntry> {
        let array = JSON.parse(obj);
        let mapResult = new Map<string, AppOptionEntry>();
        for (let i = 0; i < array.length; i++) {
            let entry = array[i];
            mapResult.set(entry[0], {name: entry[1].name, options: AppOptions.fromObj(entry[1])});
        }
        return mapResult;
      }
}