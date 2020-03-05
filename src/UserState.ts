import {AppOptions} from "./AppOption"

export type AppOptionEntry = {
    name: string,
    options: AppOptions
}

export type UserState = {
    entries: Map<String, AppOptionEntry>
}