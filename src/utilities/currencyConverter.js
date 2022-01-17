export const calcRatio = (from, to, value) => {
    if (!ratioFetched) {
        fetchRatio()
        return Number(value).toFixed(2)
    }
    if (from === "usd" && to === "usd") return value
    else if (from === "usd") return Number(ratio[to] * value).toFixed(2)
    else if (to === "usd") return Number(value / ratio[from]).toFixed(2)
    else return Number((value / ratio[from]) * ratio[to]).toFixed(2)
}
