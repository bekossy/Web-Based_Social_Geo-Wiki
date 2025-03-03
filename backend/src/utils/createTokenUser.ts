export const createTokenUser = (user: any) => {
    return {
        userId: user._id,
        username: user.username,
    }
}
