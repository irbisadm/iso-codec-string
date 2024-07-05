export function padStart(str:string, targetLength:number, padString:string) {
    if (str.length >= targetLength) {
        return str;
    }
    const padding = padString.repeat(targetLength - str.length);
    return padding + str;
}