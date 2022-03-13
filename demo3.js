import { effect,reactive } from "./core/effect.js";
// const obj = {};
// const arr = reactive([obj]);
const arr = reactive([]);
effect(()=>{
    /* for(let key of arr){
        console.log(key,arr[key]);
    } */
    // console.log(arr.includes(1))
    arr.push(1);
    console.log(arr)
})
effect(()=>{
    arr.push(2)
    console.log(arr)
})
// console.log(arr.includes(obj))
// arr[0] = 3;
//  arr[1] = 'bar';
//  arr.length=0
//  console.log(Array.prototype.values === Array.prototype[Symbol.iterator])
 //与for in 不同的是 for of 是遍历可迭代对象的
/*  const obj = {
     val:0,
     [Symbol.iterator](){
         return {
             next(){
                 return {
                     value:obj.val++,
                     done:obj.val>10 ?true:false
                 }
             }
         }
     }
 }
 for(let value of obj){
     console.log(value)
 } */