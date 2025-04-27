export const getLocalStorageToken = () => {
    return localStorage.getItem("refreshToken")
}

export const setLocalStorageToken = (token: string) => {
    localStorage.setItem("refreshToken", token)
}

export const removeLocalStorageToken = () => {
    localStorage.removeItem("refreshToken")
}
