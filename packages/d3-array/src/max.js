export default function(values, valueof) {
  var n = values.length,
      i = -1,
      value,
      max;

  if (valueof == null) {
    /** 之所以双重循环，是为了确保values中存在可比较的元素 */
    while (++i < n) { 
      if ((value = values[i]) != null && value >= value) {
        max = value;
        while (++i < n) {
          if ((value = values[i]) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  else {
    while (++i < n) { 
      if ((value = valueof(values[i], i, values)) != null && value >= value) {
        max = value;
        
        while (++i < n) { 
          if ((value = valueof(values[i], i, values)) != null && value > max) {
            max = value;
          }
        }
      }
    }
  }

  return max;
}
