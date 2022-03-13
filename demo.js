import {watch} from './core/watch.js';
import { computed } from './core/computed.js';
import { effect,reactive } from './core/effect.js';
const data = {
    ok: true,
    text: 'hello world',
    foo: 1,
    bar: 2
}

const obj = reactive(data);
let tem1, temp2;
// const effectFn =  effect(
// () => {
// console.log('effect1 run')
// console.log(obj.foo);
// document.body.innerHTML = obj.ok ? obj.text:'not';
// tem1 = obj.text;
// effect(()=>{
//     console.log('effect2 run')
//     //obj.text = 'hello zm';
//     temp2 = obj.ok;
// })
// }, 
//()=> obj.foo+obj.bar,
//{
//  lazy: true,
/* scheduler(fn) {
    setTimeout(fn)
} */
//})
//let value =  effectFn();
//console.log(value)
// obj.foo++;
// console.log('结束了')

const sumRes = computed(()=>obj.foo+obj.bar);
effect(()=>{
     console.log(sumRes.value);
})
setTimeout(()=>{
    obj.foo++
},2000)






/* let finalData = 1;
watch(
    () => obj.bar,
    (newValue, oldValue,onInvalidate) => {
        let expired = false;
        onInvalidate(()=>{
            expired = true;
        })
        // console.log('数据变化了', newValue, oldValue)
        // const res = await fetch('/path/to/request');
        if (!expired) {
            // finalData = newValue;
            console.log(finalData)
        }
    },
    {
        //immediate: true
    }
    )

obj.bar++;
setTimeout(()=>{
    obj.bar++;
},200) */

//setTimeout(()=>{

//obj.noExist = "hello vue3"
//obj.ok = false;
//obj.text = 'hello vue3'
//},2000)
