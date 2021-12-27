// function one() {
//   const num = 1
//   console.log(num)
//   return two(num + 1)
// }

// function two(num) {
//   console.log(num)
//   return three(num + 1)
// }

// function three(num) {
//   console.log(num)
//   return num
// }

// console.log(one())

//Reduce method
// const arr = [5, 6, 10, 1]
// // acc < curr
// // return curr
// //getting maximum number
// const result = arr.reduce((acc, curr) => {
//   console.log(acc, curr)
//    const result = acc > curr ? acc : curr
//    return result
// })

// console.log(result)

//recursion
//calling same thing again in again by itself
//calling function by itself

//recursion
// function one(){
//   // no infinity

//   // one()
// }
// one()

//7! = 7 * 6 * 5 * 4 * 3 * 2 * 1
//approach-1
// function factorial(num) {
//   let result = 1
//   for (let i = 1; i < num; i++) {
//     result *= i
//   }
//   return result
// }

//0! = 1
//approach two

function factorial(num) {
  //7 * 6 * 5 * 4 * 3 * 2 * 1 * 1
  if (num < 0) {
    return num * factorial(num - 1)
  }
}

console.log(factorial(7))
