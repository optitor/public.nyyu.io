export const numberWithLength = (num, len) => {
    return `${num}`.padStart(len, "0")
}
export const getSecTomorrow = () => {
    let now = new Date()
    let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)

    let diff = tomorrow - now
    return Math.round(diff / 1000)
}
export const numberSign = (num) => {
    return Math.sign(num) >= 0 ? "+" : ""
}
export const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
