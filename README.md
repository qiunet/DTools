# DTools
> 一个工具集合. 使用vite + ts + vue + electron 搭建

## Run Setup

  ```bash
  # clone the project
  git clone git@github.com:qiunet/DTools.git

  # enter the project directory
  cd DTools

  # install dependency
  npm install

  # develop
  npm run dev
  
  # build
  npm run build
  ```


### [配置输出模板](https://ejs.co/#docs)
    模板使用 `ejs` 语法  
    数据结构:
    rows: [
        {
            cells [
                {
                    name: string // 字段名
                    val : string // 字段值 如果字符串需要输出双引号, 需要根据type自行判断.
                    type: string // 字段类型 int long string int[] long[] 后3中实际都是字符串结构.
                    
                    isStringType(): boolean; 是否是字符串类型(string int[] long[])
                    isNumberType(): boolean; 是否是数值类型(int number)
                }
            ]
        }
    ]

    Json.ejs 示例:
    [
    <%_ rows.forEach(function (row, rIndex){ _%>
        {
        <%_ row.cells.forEach(function (cell, cIndex) { _%>
            "<%= cell.name %>": <% if (cell.isStringType()) {%>"<% }%><%=cell.val%><% if (cell.isStringType()) {%>"<% }%><% if(cIndex < row.cells.length - 1) { %>,<% } %>
        <%_}); _%>
        }<% if(rIndex < rows.length - 1) { %>,<% } %>
    <%_ }); _%>
    ]

