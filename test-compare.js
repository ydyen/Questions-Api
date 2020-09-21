let Numbers = [4, 2, 5, 1, 3];
const Letters = ['a', 'b', 'd', 'c', 'z', 'r', 'f'];

const returnSmall = (a, b) => a - b;
const returnBig = (a, b) => b - a;

//console.log(Numbers.sort(returnSmall)); //1, 2, 3, 4, 5
//console.log(Numbers.sort(returnBig)); //5, 4, 3, 2, 1
//console.log(Letters.sort());  //a, b, c, d, f, r, z
//console.log(Letters.sort().reverse()) // z, r, f, d, c, b, a

/** reverse() is the same
 * as for i = Letter; i >= 0; i--;  
 * will return the last index until it reaches 0
 */