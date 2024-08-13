
let x = "cheddar cheese (dairy)"

let y = x.split(" ")

let name = y.slice(0, -1).join(" ")
let group = y[y.length - 1]

console.log(
    group
)