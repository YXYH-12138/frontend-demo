// export function deepCopy(obj) {
//   if (typeof obj !== 'object') {
//     return obj;
//   }
//   const copy = Array.isArray(obj) ? [] : {};
//   for (const [key, value] of Object.entries(obj)) {
//     copy[key] = typeof value === 'object' ? deepCopy(value) : value;
//   }
//   return copy;
// }

export function deepCopy(copyObj, targetObj = {}) {
  Array.isArray(copyObj) && (targetObj = [])
  for (const [key, value] of Object.entries(copyObj)) {
    targetObj[key] = typeof value === 'object' ? deepCopy(value) : value
  }
  return targetObj
}