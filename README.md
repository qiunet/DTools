# [DuoDuo](https://github.com/qiunet/DuoDuo) > DTools
> 一个服务端工具集合. 使用vite + ts + vue + electron 搭建
> 主要是搭配DuoDuo实现服务端的一些功能配置.

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

### excel格式

| 行数  | 内容     | 示例                                    |
|-----|--------|---------------------------------------|
| 1   | 中文描述   | 随意.给策划看                               |
| 2   | 代码中变量名 | id val...                             |
| 3   | 类型     | int / long / string / int[] / long[]  |
| 4   | 输出范围   | ALL / CLIENT / SERVER / IGNORE(忽略输出列) |



>  如果第二行变量名为 ".ignore". 并且某一行数据中该列的值标注为 true  yes 1 等值. 这行数据忽略.



### sheet 规则

1. sheet 如果为end . 后面的内容就不会读取.
2. sheet 如果开头为 # 该sheet忽略.不读取
3. sheet 名包含 `c.` 表示仅客户端需要. `s.` 表示仅服务器需要
4. sheet 名包含其它比如`lua.` 表示客户端需要按照lua输出. 会去 home目录下的`.dTools/ejs` 找对应的ejs模板


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
            "<%= cell.name %>": <% if (cell.isStringType()) {%>"<% }%><%-cell.val%><% if (cell.isStringType()) {%>"<% }%><% if(cIndex < row.cells.length - 1) { %>,<% } %>
        <%_}); _%>
        }<% if(rIndex < rows.length - 1) { %>,<% } %>
    <%_ }); _%>
    ]

### 界面

![批量登录](img/GameLogin1.png)
![协议联调](img/GameLogin2.png)
![GM命令](img/GmCommand.png)
![工具集合](img/Tools.png)
![行为树编辑](img/BehaviorTree1.png)
![行为树菜单](img/BehaviorTree2.png)
![Excel转配置Json](img/ExcelToCfg.png)

