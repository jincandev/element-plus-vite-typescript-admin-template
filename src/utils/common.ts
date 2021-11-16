import settings from "@/settings"

export function getPageTitle(title?: string): string {
    if(title) {
        return `${title} - ${settings.title}`
    }
    return settings.title
}
