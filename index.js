var testArray = [1, 2, 3, [4, 5]]
var testObj = {
  a: 1,
  b: 2
  
}


//操作类型
// $copy 拷贝一份副本
// $push 数组尾部插入元素(1个或多个)
// $unshift 数组的头部插入一个或者多个元素
// $deepmerge 对象的深层次合并
// $objmap 对象map
// $replace 替换整个目标
// $splice 等同于数组的splice， 区别在于传参的方式
// $deepmap 数组的深层次map
// $exchange 数组的两个元素交换位置
// $move 将原本存在的一个元素移动位置
// $puremap
var COMMAND_COPY = '$copy'
var COMMAND_PUSH = '$push'
var COMMAND_UNSHIFT = '$unshift'
var COMMAND_MERGE = '$deepmerge'
var COMMAND_OBJMAP = '$objmap'
var COMMAND_REPLACE = '$replace'
var COMMAND_SPLICE = '$splice'
var COMMAND_DEEPAPLLY = '$deepmap'
var COMMAND_EXCHANGE = '$exchange'
var COMMAND_MOVE = '$move'
var COMMAND_PUREMAP = '$puremap'

var COMMAND_LIST = [COMMAND_COPY, COMMAND_PUSH, COMMAND_UNSHIFT, COMMAND_MERGE, COMMAND_OBJMAP,
  COMMAND_REPLACE,COMMAND_SPLICE, COMMAND_DEEPAPLLY, COMMAND_EXCHANGE, COMMAND_MOVE, COMMAND_PUREMAP
]

var functionList = {
  copyUpdate: copyUpdate,
  pushUpdate: pushUpdate,
  unshiftUpdate: unshiftUpdate,
  replaceUpdate: replaceUpdate,
  spliceUpdate: spliceUpdate,
  deepmapUpdate: deepmapUpdate,
  exchangeUpdate: exchangeUpdate,
  moveUpdate: moveUpdate,
  deepmergeUpdate: deepmergeUpdate,
  objmapUpdate: objmapUpdate,
  puremapUpdate: puremapUpdate
}

function update(initialArray, command, data) {
  var pureExec = /^\$(\w*)$/.exec(command)
  var pureCommand = pureExec && pureExec[1]
  console.log(pureCommand)
  if(!pureCommand || !COMMAND_LIST.some(function(eCommand) {return eCommand === command})) {
    return console.log('没有此命令')
  }
  var fName = pureCommand + 'Update'
  
  return functionList[fName](initialArray, data)
}

function copyUpdate(initialArray) {
  return deepCopy(initialArray)
}

function pushUpdate(initialArray, data) {
  if(!Array.isArray(data)) {
    return console.log('期望的数据类型是数组')
  }
  return deepCopy(initialArray).concat(data)
}

function unshiftUpdate(initialArray, data) {
  if(!Array.isArray(data)) {
    return console.log('期望的数据类型是数组')
  }
  var copyArray = deepCopy(initialArray)
  for(var i = data.length - 1; i >= 0; i--) {
    copyArray.unshift(data[i])
  }
  return copyArray
}

function replaceUpdate(initialArray, data) {
  return data
}

function spliceUpdate(initialArray, data) {
  if(!Array.isArray(data)) {
    return console.log('期望的数据类型是数组')
  }
  var copyArray = deepCopy(initialArray)
  var index = data[0]
  var deleteCount = data[1]

  copyArray.splice(index, deleteCount)
  for(var i = 2; i < data.length; i++) {
    copyArray.splice(index + (i - 2), 0, data[i])
  }

  return copyArray
}

function deepmapUpdate(initialArray, fn) {
  if(!type(fn) === '[object Function]') {
    return console.log('不是方法')
  }
  var copyArray = deepCopy(initialArray)

  for(var i = 0; i < copyArray.length; i++) {
    if(Array.isArray(copyArray[i])){
      copyArray[i] = deepmapUpdate(copyArray[i], fn)
    } else {
      copyArray[i] = copyArray[i] = typeof(copyArray[i]) === 'object' ? copyArray[i] : fn(copyArray[i])
    }
  }

  return copyArray
}

function exchangeUpdate(initialArray, data) {
  if(!Array.isArray(data)) {
    return console.log('期望的数据类型是数组')
  }
  var sourceIndex = data[0]
  var targetIndex = data[1]
  var copyArray = deepCopy(initialArray)
  var sourceData = copyArray[sourceIndex]
  var targetData = copyArray[targetIndex]
  copyArray[sourceIndex] = targetData
  copyArray[targetIndex] = sourceData

  return copyArray
}

function moveUpdate(initialArray, data) {
  if(!Array.isArray(data)) {
    return console.log('期望的数据类型是数组')
  }
  var sourceIndex = data[0]
  var targetIndex = data[1]
  var copyArray = deepCopy(initialArray)
  var sourceData = deepCopy(copyArray[sourceIndex])
  if(sourceIndex === targetIndex) {return copyArray }
  sourceIndex = sourceIndex > targetIndex ? ++sourceIndex : sourceIndex
  copyArray.splice(targetIndex, 0, sourceData)
  copyArray.splice(sourceIndex, 1)
  
  return copyArray
}

function deepmergeUpdate(sourceObj, data) {
  if(type(sourceObj) !== type(data)) {
    return console.log('源数据和目标数据类型不同')
  }
  var copyObject = deepCopy(sourceObj) 

  return deepMergeObj(copyObject, data)
}

function objmapUpdate(sourceObj, targetObj) {
  if(type(targetObj) !== '[object Object]') {
    return console.log('期望的数据类型是对象')
  }
  var copyObject = deepCopy(sourceObj)
  for(var i in targetObj) {
    if(copyObject.hasOwnProperty(i) && type(targetObj[i]) === '[object Function]') {
      copyObject[i] = targetObj[i](copyObject[i])
    }
  }
  return copyObject
}

function puremapUpdate(sourceObj, fn) {
  if(type(fn) !== '[object Function]') {
    return console.log('期望的数据类型是函数')
  }
  var copyObject = deepCopy(sourceObj)

  for(var i in copyObject) {
    if(copyObject.hasOwnProperty(i)) {
      copyObject[i] = fn(copyObject[i])
    }
  }

  return copyObject
}

function deepMergeObj(sourceObj, targetObj) {
  if(type(targetObj) !== '[object Object]') {
    return targetObj
  }
  for(var i in targetObj) {
    if(sourceObj.hasOwnProperty(i)) {
      if(typeof targetObj[i] === 'object') {
        sourceObj[i] = deepMergeObj(sourceObj[i], targetObj[i])
      } else {
        sourceObj[i] = targetObj[i]
      }
    } else {
      sourceObj[i] = targetObj[i]
    }
  }
  return sourceObj
}

function type(obj) {
  return Object.prototype.toString.apply(obj, [])
}

function deepCopy(source, target) {
  let isObject = (source && typeof source === 'object')
  if (!isObject) { console.warn('source 不是对象类型'); return source}
  target = target || Array.isArray(source) ? [] : {}

  for (var i in source) {
    if(!source.hasOwnProperty(i)) {
      return;
    }
    if (source[i] && typeof source[i] === 'object') {
      target[i] = deepCopy(source[i], target[i], Array.isArray(source[i]))
    } else {
      target[i] = source[i]
    }
  }
  return target
}

// var result = update(testArray, '$puremap', function(a) {
//   return a * 2;
// })
var result = update(testArray, '$splice', [1, 1, 6, 7])
console.log(result)