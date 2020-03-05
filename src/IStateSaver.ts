import { AppOptions } from './AppOption'
import { UserState } from './UserState'

export interface IStateSaver {
    save(appState : UserState) : Promise<void>;
    load() : Promise<UserState>;
}