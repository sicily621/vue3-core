export let activeEffect;
const effectStack = [];
let bucket = new WeakMap();
const ITERATE_KEY = Symbol();
const reactiveMap = new Map();
const triggerType = {
    SET:'SET',
    ADD:'ADD'
}
const originMethod = Array.prototype.includes;
const arrayInstrumentations = {};
['includes','indexOf','lastIndexOf'].forEach(method=>{
    const originMethod = Array.prototype[method];
    arrayInstrumentations[method] = function(...args){
        let res = originMethod.apply(this,args);
        if(res === false){
            res = originMethod.apply(this.raw,args);
        }
        return res;
    }
})
let shouldTrack = true;
['push','pop','shift','unshift','splice'].forEach(method=>{
    const originMethod = Array.prototype[method];
    arrayInstrumentations[method] = function(...args){
        shouldTrack = false;
        let res = originMethod.apply(this,args);
        shouldTrack = true;
        return res;s
    }
})
export function readonly(data){
    return reactive(data,false,true);
}
export function shallowReadonly(data){
    return reactive(data,true,true);
}
export function shallowReactive(data){
    return reactive(data,true)
}
export function reactive(data,isShallow = false,isReadonly = false){
    const existionProxy = reactiveMap.get(data);
    if(existionProxy) return existionProxy;
    const proxy  = new Proxy(data, {
        get(target, key,receiver) {
            if(key === 'raw'){
                return target;
            }
            if(Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)){
                return Reflect.get(arrayInstrumentations,key,receiver);
            }
            if(!isReadonly && typeof key != 'symbol'){
                track(target, key);
            }
            const res = Reflect.get(target,key,receiver);
            if(isShallow){
                return res;
            }
            if(typeof res === 'object' && res!==null){
                return isReadonly ? readonly(res) : reactive(res);
            }
            return res;
        },
        set(target, key, newVal,receiver) {
            if(isReadonly){
                console.warn(`属性 ${key}是只读的`)
                return true;
            }
            const oldVal = target[key];
            const type = Array.isArray(target) 
            ? Number(key) < target.length ?'SET':'ADD'
            : Object.prototype.hasOwnProperty.call(target,key)?'SET':'ADD';
            const res = Reflect.set(target,key,newVal,receiver)
            if(target === receiver.raw){
                if(oldVal!=newVal && (oldVal===oldVal || newVal === newVal)){
                    trigger(target, key,type,newVal);
                }
            }
            return res;
        },
        deleteProperty(target,key){
            if(isReadonly){
                console.warn(`属性 ${key}是只读的`);
                return true;
            }
            const hadKey = Object.prototype.hasOwnProperty.call(target,key);
            const res = Reflect.deleteProperty(target,key);
            if(res && hadKey){
                trigger(target,key,'DELETE')
            }
            return res;
        },
        has(target,key){
            console.log('触发has')
            track(target,key);
            return Reflect.has(target,key);
        },
        ownKeys(target){
            track(target,Array.isArray(target) ? 'length' : ITERATE_KEY);
            return Reflect.ownKeys(target);
        },
    })
    reactiveMap.set(data,proxy);
    return proxy;
}
export function effect(fn, options = {}) {
    const effectFn = () => {
        cleanup(effectFn);
        activeEffect = effectFn;
        effectStack.push(effectFn);
        const res = fn()
        effectStack.pop();
        activeEffect = effectStack[effectStack.length - 1];
        return res;
    }
    effectFn.options = options;
    effectFn.deps = [];
    if (!options.lazy) {
        effectFn();
    }
    return effectFn;
}

export function cleanup(effectFn) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i];
        deps.delete(effectFn);
    }
    effectFn.deps.length = 0;
}

export function track(target, key) {
    if (!activeEffect || !shouldTrack) return;
    let depsMap = bucket.get(target);
    if (!depsMap) {
        bucket.set(target, (depsMap = new Map()))
    }
    let deps = depsMap.get(key);
    if (!deps) {
        depsMap.set(key, (deps = new Set()));
    }
    deps.add(activeEffect); //添到桶里
    activeEffect.deps.push(deps);
}

export function trigger(target, key,type,newVal) {
    const depsMap = bucket.get(target);
    if (!depsMap) return;
    const effects = depsMap.get(key);
    const iterateEffects = depsMap.get(ITERATE_KEY);
    const effectRun = new Set();
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectRun.add(effectFn)
        }
    })
    if(Array.isArray(target) && key === 'length'){
        depsMap.forEach((effects,key)=>{
            if(key>=newVal){
                effects.forEach(effectFn => {
                    if (effectFn !== activeEffect) {
                        effectRun.add(effectFn)
                    }
                })
            }
        })
    }
    if(type == 'ADD' && Array.isArray(target)){
        const lengthEffects = depsMap.get('length');
        lengthEffects && lengthEffects.forEach(effectFn=>{
            if (effectFn !== activeEffect) {
                effectRun.add(effectFn)
            }
        })
    }
    if(type=='ADD' || type == 'DELETE'){
        iterateEffects && iterateEffects.forEach(effectFn => {
            if (effectFn !== activeEffect) {
                effectRun.add(effectFn)
            }
        })
    }
    effectRun.forEach(effectFn => {
        if (effectFn.options.scheduler) {
            effectFn.options.scheduler(effectFn);
        } else {
            effectFn();
        }
    });
    //  effects && effects.forEach(fn => fn());
}