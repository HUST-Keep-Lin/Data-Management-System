## 前端目录结构

```
|-- client
    |-- .gitignore
    |-- package-lock.json
    |-- package.json
    |-- README.md
    |-- tsconfig.json
    |-- build
    |   |-- asset-manifest.json
    |   |-- favicon.ico
    |   |-- index.html
    |   |-- logo192.png
    |   |-- manifest.json
    |   |-- robots.txt
    |   |-- static
    |       |-- css
    |       |   |-- main.5e6091a5.css
    |       |   |-- main.5e6091a5.css.map
    |       |-- js
    |           |-- main.a436c39b.js
    |           |-- main.a436c39b.js.LICENSE.txt
    |           |-- main.a436c39b.js.map
    |-- public   //静态文件目录
    |   |-- favicon.ico
    |   |-- index.html
    |   |-- logo192.png
    |   |-- manifest.json
    |   |-- robots.txt
    |-- src  
        |-- App.css
        |-- App.tsx
        |-- index.css
        |-- index.tsx
        |-- react-app-env.d.ts
        |-- setupTests.ts
        |-- type.d.ts
        |-- components
        |   |-- MyDataModal  //数据页的视图组件
        |   |   |-- index.tsx
        |   |-- MyTagModal  //标签页的视图组件
        |       |-- index.tsx
        |-- pages  //单页面路由
        |   |-- DataManage //数据页面
        |   |   |-- index.css
        |   |   |-- index.tsx
        |   |-- Home      //主页面
        |   |   |-- index.css
        |   |   |-- index.tsx
        |   |-- TagManage //标签页面
        |       |-- index.tsx
        |-- routes    //路由
        |   |-- index.tsx
        |-- slice    //redux的数据分片
        |   |-- language.ts
        |-- store   //redux的状态管理store
        |   |-- index.ts
        |-- utils   //工具文件
            |-- index.ts
            |-- api //前端axios请求
                |-- info.ts
                |-- language.ts
                |-- tag.ts

```



## 前端页面实现

### 1 路由实现

更具业务需求，采用了嵌套路由进行实现

- 实现了路由的重定向，默认路由 `/home`，默认页面必须为 `<Home/>`

- 嵌套组件默认为 `<DataManage/>`
- `/home/tagmanage`为标签页，展示 `<TagManage/>`组件

```tsx
//路由表
const routes = [
  {
    //实现路由的重定向 使得默认页面为home
    path: '*',
    element: <Navigate to='/home'/>
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        //默认路由为数据管理
        path: '',
        element: <DataManage />
      },
      {
        path: 'tagmanage',
        element: <TagManage />
      }
    ]
  },
];
```

---

### 2 前端API接口

#### 2.1 数据接口

```typescript
//获取数据接口 GET
getData(name, tags, addTime)
//删除数据接口 DELETE
deleteData(key)
//新增数据 POST
addData(value)
//修改数据 PUT
editData(value)
```

#### 2.2 标签接口

```typescript
//获取标签数据 GET
getTags()
//删除标签数据 DELETE
deleteTag(key)
//新增标签数据 POST
addTag(value) 
//编辑标签数据 PUT
edit(value)
```

#### 2.3 语言接口

```typescript
//获取语言信息 GET
getLanguage(languageType)
```

---

### 3 全局状态 redux

> store只有language分片

通过`redux`进行全局状态管理，设置语言信息。初始语言为中文，通过异步任务获取数据库的语言信息进行设置中英文，并需要将`state`的类型导出

### 4 Home页面

<img src="C:\Users\Keep_L\AppData\Roaming\Typora\typora-user-images\image-20230809162216395.png" alt="image-20230809162216395" style="zoom:50%;" />

使用`Layout`布局进行整体页面的设置，分为上中两栏，顶部`Header`为数据库管理系统的名称以及全局设置信息。下方左侧为侧边栏，右侧为嵌套组件，基于嵌套路由实现所需要渲染的组件



其中，右上方的设置设置了下拉框，可以选择对应的语言，中文或者英文，通过向后端发送数据请求得到

### 5 Datamanage页面

#### 5.1 搜索功能

使用`Input`、`Select`、`RangePicker`三个组件分别收集搜索的名称、标签、添加事件信息，按下**回车**可以实现搜索的功能。同时，使用了`label`标签，将其与输入内容进行对应。

#### 5.2 添加功能

添加的视图进行了组件封装，与编辑视图使用同一组件 `MyDataModal`，通过传递`props`中的`open`来确认打开的是新增视图还是编辑视图，视图中的数据使用`Form`组件中的`useForm`钩子进行管理，由于新增的视图框没有初始值，而编辑的视图框有初始值，所以 `MyDataModal`组件有一个可选`props`——`initialValue`，编辑视图存在这个`props`，而新增没有。

注意在`Form`表单收集数据时，要使用`form.resetFields()`对表单的数据进行重置，异步获取到数据渲染到表单上

#### 5.3 表格展示功能

`Table`组件进行分页，配置`Pagination`，实现了动态分页的功能





### 
