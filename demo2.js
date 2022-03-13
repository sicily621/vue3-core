import { effect,reactive ,shallowReactive,readonly,shallowReadonly} from "./core/effect.js";
//理解Reflect
/* var myObject = {
    foo: 1,
    bar: 2,
    get baz() {
      return this.foo + this.bar;
    },
  };
  
  var myReceiverObject = {
    foo: 4,
    bar: 4,
  };
  
  var a = Reflect.get(myObject, 'baz', myReceiverObject) // 8
  console.log(a) */
  // const obj = {
  //   foo:1,
  //   get bar(){
  //     return this.foo
  //   }
  // };
  // const p = reactive(obj);
  // effect(()=>{
    // console.log(p.bar)
    // 'foo' in p
    // for(const key in p){
    //   console.log(key)
    // }
    //console.log(p.foo)
  // })
  //p.a = 3;//新增触发ownKey
  // p.foo =2;//修改不触发ownKey
  // delete p.foo;//删除触发for in ownKey
  // p.foo = 1;


  // const obj = {};
  // const proto = {bar:1};
  // const child = reactive(obj);
  // const parent = reactive(proto);
  // Object.setPrototypeOf(child,parent);
  // effect(()=>{
  //   console.log(child.bar);
  // })
  // child.bar = 2;


  //深响应与浅响应
  const obj = shallowReadonly({foo:{bar:1}});
  effect(()=>{
    console.log(obj.foo.bar);
  })
  obj.foo.bar = 2;