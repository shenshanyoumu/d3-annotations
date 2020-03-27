function none() {}

// querySelector是DOM原生方法，当然在node层也可以使用JSDOM模拟
export default function(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}
