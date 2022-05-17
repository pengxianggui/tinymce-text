import cloneDeep from 'lodash/cloneDeep'

/**
 * @description merge 策略1: 将opt2 merge到opt1, 对于opt1已有的key-value, 保持不变, 对于opt2中新的key-value, 追加到opt1中。传入
 * deep值表示是否深度执行merge逻辑(不传入则为true). 函数将更改opt1的值, 同时返回一个merge后的新对象(opt1的深拷贝)。
 * @param opt1 opt1中的k-v将保留
 * @param opt2 不会改变opt2
 * @param deep 是否深拷贝模式, 默认true
 * @returns {} 返回merge后的opt1的深拷贝对象
 */
export function merge(opt1, opt2, deep = true) {
    let self = this;

    if (opt2 === null || !isObject(opt2)) {
        console.warn("typeof opt2: %s , must be 'object' and should not be a null value.", opt2);
        return cloneDeep(opt1);
    }

    if (opt1 === null || !isObject(opt1)) {
        console.warn("typeof opt1: %s , must be 'object' and should not be a null value.", opt1);
        return cloneDeep(opt2);
    }

    let deepMerge = function (obj1, obj2) {
        if (!isObject(obj1) || !isObject(obj2)) return;
        for (let key in obj2) {
            if (!(key in obj1)) {
                set(self, obj1, key, cloneDeep(obj2[key]));
            } else {
                if (!deep) return;
                deepMerge(obj1[key], obj2[key])
            }
        }
    };

    // deep merge
    deepMerge(opt1, opt2);
    return cloneDeep(opt1);
}


/**
 * @description merge 策略2： 对两个对象中的属性和值执行merge操作, 将opt2中的key-value根据key merge到opt1上： 若op1也存在这个key，则取opt2这个key的值
 * 覆盖到opt1上； 若opt1中不存在, 则会被直接追加到opt1中， 因此函数会更改opt1, 执行完后, opt1将是merge后的对象。最后将opt1的深拷贝返回
 * @param opt1 opt1中的k-v将被覆盖
 * @param opt2
 * @param deep 是否深拷贝模式, 默认true
 * @param ignoreNullAndUndefined 若为true, 则当opt2中的键值如果是null或undefined, 则不会覆盖到opt1中。默认是false
 * @returns {} 返回merge后的opt1的深拷贝对象
 */
export function reverseMerge(opt1, opt2, deep = true, ignoreNullAndUndefined = false) {
    let self = this;

    if (opt2 === null || !isObject(opt2)) {
        console.warn("typeof opt2: %s , must be 'object' and should not be a null value.", opt2);
        return cloneDeep(opt1);
    }

    if (opt1 === null || !isObject(opt1)) {
        console.warn("typeof opt1: %s , must be 'object' and should not be a null value.", opt1);
        return cloneDeep(opt2);
    }

    let deepMerge = function (obj1, obj2) {
        for (let key in obj2) {
            let valueOfObj1 = obj1[key]
            let valueOfObj2 = obj2[key]

            if (ignoreNullAndUndefined === true && (isUndefined(valueOfObj2) || isNull(valueOfObj2))) {
                continue
            }

            if (key in obj1) {
                if (isObject(valueOfObj1) && isObject(valueOfObj2) && deep) {
                    deepMerge(valueOfObj1, valueOfObj2)
                } else {
                    set(reverseMerge.prototype.Vue, self, obj1, key, cloneDeep(valueOfObj2));
                }
            } else {
                set(reverseMerge.prototype.Vue, self, obj1, key, cloneDeep(valueOfObj2));
            }
        }
    };

    deepMerge(opt1, opt2);
    return cloneDeep(opt1);
}

/**
 * keng
 * @param self
 * @param obj
 * @param key
 * @param value
 */
function set(self, obj, key, value) {
    obj[key] = value;
}

/**
 * 判断值是否为对象. 数组、null等都将返回false, 只有严格的{}才会返回true
 * @param obj
 */
export function isObject(val) {
    let toStr = Object.prototype.toString.call(val);
    return toStr === '[object Object]'
}

export function isUndefined(val) {
    let toStr = Object.prototype.toString.call(val);
    return toStr === '[object Undefined]'
}

export function isNull(val) {
    let toStr = Object.prototype.toString.call(val);
    return toStr === '[object Null]'
}
