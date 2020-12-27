var EOL = {},
    EOF = {},
    QUOTE = 34, //ASCII引号
    NEWLINE = 10, // ASCII换行符
    RETURN = 13; //ASCII 回车符

/**
 * 
 * @param {*} columns 表示表头名称数组，比如['name','sex']
 * 返回新建函数t，函数t接收数组形式的表格数据['sam','female']，并返回键值对形式
 * {name:'sam',sex:'female'}
 */
function objectConverter(columns) {
  return new Function("d", "return {" 
    + columns.map(function(name, i) {
    return JSON.stringify(name) + ": d[" + i + "] || \"\"";
  }).join(",") + "}");
}

/**
 * 
 * @param {*} columns 表示表头字段数组
 * @param {*} f 自定义的转换函数
 */
function customConverter(columns, f) {
  // object函数接收字段数组，并返回相应的键值对形式
  var object = objectConverter(columns);

  // 新函数接收tabular-数据行和行索引
  return function(row, i) {
    return f(object(row), i, columns);
  };
}

// 根据形如[{key1:value1,key2:value2}]的数据行形式反推表头字段数组
function inferColumns(rows) {
  var columnSet = Object.create(null),
      columns = [];
  
  // 知识点：for...in，输出对象及其原型链对象所有可枚举的属性
  rows.forEach(function(row) {
    for (var column in row) {
      if (!(column in columnSet)) {
        columns.push(columnSet[column] = column);
      }
    }
  });

  // 注意最终columns每个元素都是一样的对象，因为共享columnSet对象
  return columns;
}

/** 前缀补0操作 */
function pad(value, width) {
  var s = value + "", length = s.length;
  return length < width ? new Array(width - length + 1).join(0) + s : s;
}

/** 年份格式化，针对不同年份区间的补位操作 */
function formatYear(year) {
  return year < 0 ? "-" + pad(-year, 6)
    : year > 9999 ? "+" + pad(year, 6)
    : pad(year, 4);
}

/**
 * 将本地化时间对象转换为格式化的UTC时间对象
 * @param {*} date 表示本地化的时间对象
 */
function formatDate(date) {
  /** 
   * UTC-universal time coordinated，即协调世界时
   * getUTCHours()返回本地时间与UTC时间的小时差值
   */
  var hours = date.getUTCHours(),
      minutes = date.getUTCMinutes(),
      seconds = date.getUTCSeconds(),
      milliseconds = date.getUTCMilliseconds();

  return isNaN(date) ? "Invalid Date"
      : formatYear(date.getUTCFullYear(), 4) + "-" + pad(date.getUTCMonth() + 1, 2) + "-" + pad(date.getUTCDate(), 2)
      + (milliseconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "." + pad(milliseconds, 3) + "Z"
      : seconds ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2) + "Z"
      : minutes || hours ? "T" + pad(hours, 2) + ":" + pad(minutes, 2) + "Z"
      : "");
}

/**
 * 传入特定的分隔符，比如"\t"
 * @param {*} delimiter 
 */
export default function(delimiter) {
  //分隔符+'\n\r'用于数据换行后的分隔处理
  var reFormat = new RegExp("[\"" + delimiter + "\n\r]"),

      /** 返回某个字符的Unicode编码值 */
      DELIMITER = delimiter.charCodeAt(0);

  function parse(text, f) {
    var convert, columns, rows = parseRows(text, function(row, i) {
      if (convert) return convert(row, i - 1);
      columns = row, convert = f ? customConverter(row, f) : objectConverter(row);
    });
    rows.columns = columns || [];
    return rows;
  }

  function parseRows(text, f) {
    var rows = [], // output rows
        N = text.length,
        I = 0, // current character index
        n = 0, // current line number
        t, // current token
        eof = N <= 0, // 表示指针指向文本结束位置
        eol = false; // 表示指向文本最后一行

    //剔除文本内容最后的回车换行符号
    if (text.charCodeAt(N - 1) === NEWLINE) --N;
    if (text.charCodeAt(N - 1) === RETURN) --N;

    function token() {
      if (eof) return EOF;
      if (eol) return eol = false, EOL;

      // Unescape quotes.
      var i, j = I, c;

      /** 当遍历文本内容遇到引号 */
      if (text.charCodeAt(j) === QUOTE) {

        /** 继续遍历，直到遇到另一个引号为止 */
        while (I++ < N && text.charCodeAt(I) !== QUOTE || text.charCodeAt(++I) === QUOTE);
       
        if ((i = I) >= N) eof = true;
        else if ((c = text.charCodeAt(I++)) === NEWLINE) eol = true;
        else if (c === RETURN) {
           eol = true; if (text.charCodeAt(I) === NEWLINE) ++I;
          }

        /** 返回引号包围的内容 */
        return text.slice(j + 1, i - 1).replace(/""/g, "\"");
      }

      // Find next delimiter or newline.
      while (I < N) {
        if ((c = text.charCodeAt(i = I++)) === NEWLINE) eol = true;
        else if (c === RETURN) {
           eol = true;
            if (text.charCodeAt(I) === NEWLINE)
               ++I;
         }
        else if (c !== DELIMITER) continue;
        return text.slice(j, i);
      }

      // Return last token before EOF.
      return eof = true, text.slice(j, N);
    }

    while ((t = token()) !== EOF) {
      var row = [];
      while (t !== EOL && t !== EOF) row.push(t), t = token();
      if (f && (row = f(row, n++)) == null) continue;
      rows.push(row);
    }

    return rows;
  }

  /**
   * tabular数据的格式化，
   * 返回[value1\delimiter\value2,value3\delimiter\value3]形式
   * @param {*} rows 形如[{key1:value1,key2:value2}] 的数据行
   * @param {*} columns 形如[key1,key2]的表头名称数组
   */
  function preformatBody(rows, columns) {
    return rows.map(function(row) {
      return columns.map(function(column) {
        return formatValue(row[column]);
      }).join(delimiter);
    });
  }

  // 将tabular的表头和数据行整合格式化输出
  function format(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return [columns.map(formatValue).join(delimiter)]
      .concat(preformatBody(rows, columns))
      .join("\n");
  }

  // 如果没有传递表头名称数组，则从数据行中推导出表头
  function formatBody(rows, columns) {
    if (columns == null) columns = inferColumns(rows);
    return preformatBody(rows, columns).join("\n");
  }

  function formatRows(rows) {
    return rows.map(formatRow).join("\n");
  }

  function formatRow(row) {
    return row.map(formatValue).join(delimiter);
  }

  // 格式化键值，对时间对象单独处理
  function formatValue(value) {
    return value == null ? ""
        : value instanceof Date ? formatDate(value)
        : reFormat.test(value += "") ? "\"" + value.replace(/"/g, "\"\"") + "\""
        : value;
  }

  return {
    parse: parse,
    parseRows: parseRows,
    format: format,
    formatBody: formatBody,
    formatRows: formatRows,
    formatRow: formatRow,
    formatValue: formatValue
  };
}
