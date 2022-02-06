export const openAlert = (it, type, message) => {
    it.alertOpen = true
    it.type = type
    it.message = message
}

export const isNullOrEmpty = (element) => {
    return !element || element.trim() === ''
}

export const avoidDuplicatedNavigation = (e) => {
    if (e.name !== "NavigationDuplicated")
        console.error(e)
}