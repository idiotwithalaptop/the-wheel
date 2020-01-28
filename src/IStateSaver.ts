import { AppOptions } from './AppOption'

export type ApplicationState = {
    options: AppOptions
}

export interface IStateSaver {
    save(appState : ApplicationState) : Promise<void>;
    load() : Promise<ApplicationState>;
}