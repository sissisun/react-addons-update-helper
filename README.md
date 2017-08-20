# react-addons-update-helper
> 在数据比较复杂的react项目中，state以及props一般是较为复杂的数组或者对象之类的引用类型数据，而我们更新状态时为了不破坏react更新状态的机制（this.setState），一般是不直接修改状态的值。这个插件主要就是为了以上问题，并且提供了一些操作数组和对象的便捷方法。

## 引入方法
```javascript
import update from react-addons-update-helper
// 或者
var update = require('react-addons-update-helper')
// 或者
<script src='{path}/react-addons-update-helper.js'></script>
```
## 使用方法
```javascript
var resultData = update(initialData, opertName, changeData)
// initialData是原始数据
// operateName是要进行的操作的名字，可能是$copy, $push, $deepmerge...
// changeData是你要更新的数据
```

## 提供的操作
### $copy
**深拷贝原始数据**
```javascript
var initialData = [1, 2, 3, [4, 5]]
var resultData = update(initialData, '$copy')
// resultData = [1, 2, 3, [4, 5]]
// initialData[1] = 6
// initialData = [6, 2, 3, [4, 5]]
// resultData = [1, 2, 3, [4, 5]]
```

### $push
**在数组的尾部插入一个或者多个元素**
```javascript
var initialData = [1, 2, 3, [4, 5]]
var resultData = update(initialData, '$push', [6, [7, 8]])
// resultData = [1, 2, 3, [4, 5], 6, [7, 8]]
```

### $unshift
**在数组的头部插入一个或者多个元素**
```javascript
var initialData = [1, 2, 3, [4, 5]]
var resultData = update(initialData, '$unshift', [6, [7, 8]])
// resultData = [6, [7, 8], 1, 2, 3, [4, 5]]
```

### $replace
**讲原始数据用目标数据替换**
```javascript
var initialData = [1, 2, 3, [4, 5]]
var resultData = update(initialData, '$replace', [6, [7, 8]])
// resultData = [6, [7, 8]]
```

### $replace
**讲原始数据用目标数据替换**
```javascript
var initialData = [1, 2, 3, [4, 5]]
var resultData = update(initialData, '$replace', [6, [7, 8]])
// resultData = [6, [7, 8]]
```

### $splice
**类似数组的splice，区别在于传参方式**
```javascript
var initialData = [1, 2, 3, [4, 5]]
var resultData = update(initialData, '$splce', [1, 1, 6, 7])
// 数组的第一个元素代表操作的位置，第二个代表需要删除的个数，再往后代表需要插入的元素
// resultData = [1, 6, 7, 3, [4, 5]]
```
objmap
### $deepmap
**对数组的每个元素应用回调函数（深层次）, 如果子元素不是数组，则不做任何处理**
```javascript
var initialData = [1, 2, 3, [4, 5], {a: 2}]
var resultData = update(initialData, '$deepmap', function(item){return item * 2 }）
// 数组的第一个元素代表操作的位置，第二个代表需要删除的个数，再往后代表需要插入的元素
// resultData = [2, 4, 6, [8, 10], {a: 2}]
```

### $exchange
**交换数组的元素**
```javascript
var initialData = [1, 2, 3, [4, 5], {a: 2}]
var resultData = update(initialData, '$exchange', [2, 4]）
// resultData = [1, 2, {a: 2}, [4, 5], 3]
```

### $move
**将数组给定位置的元素移动到给定位置**
```javascript
var initialData = [1, 2, 3, [4, 5], {a: 2}]
var resultData = update(initialData, '$move', [3, 0]）
// resultData = [ [ 4, 5 ], 1, 2, 3, { a: 2 } ]
```

### $objmap
**对给出的目标对象的属性应用对应的回调方法**
```javascript
var initialData = {a: 1, b: 2}
var resultData = update(initialData, '$objmap', {a: function(item){return item * 2 }}）
// resultData = {a: 2, b: 2}
```

### $deepmerge
**对象深层次合并**
```javascript
var initialData = {a: 1, b: 2, c: {d: 5, e: [4, 3]}}
var resultData = update(initialData, '$objmap', {a: 7, c: {d: 'test', e: [6]}}）
// resultData = { a: 7, b: 2, c: { d: 'test', e: [ 6 ] } }
```

### $puremap
**数组、对象通用的对每个元素应用回调函数，不做任何判断，浅层次**
```javascript
var initialData = {a: 1, b: 2, c: {d: 5, e: [4, 3]}}
var resultData = update(initialData, '$puremap', function(item){return item * 2}）
// resultData = { a: 2, b: 4, c: NaN }
```