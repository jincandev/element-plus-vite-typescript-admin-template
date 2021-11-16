import Storage from "./storage";

const TOKEN_KEY = "nardy:token"

export const AuthToken = {
    get() {
        return Storage.get(TOKEN_KEY)
    },
    set(token: string) {
        return Storage.set(TOKEN_KEY, token)
    },
    del() {
        Storage.del(TOKEN_KEY)
    }
}