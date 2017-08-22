# redux-saga-model-loading
redux-saga-model 的 loading 插件



## install

```bash
$ npm i redux-saga-model-loading
```

or

```bash
$ yarn add redux-saga-model-loading
```



## 使用

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import "antd/dist/antd.css";

import loading from 'redux-saga-model-loading';
import sagaModel from "reudx-saga-model";
import Layout from "./view/Layout.jsx";
import UsersTable from "./view/UsersTable.jsx";


sagaModel.use(loading);

ReactDOM.render(
  <Provider store={sagaModel.store()}>
    <Layout>
      <UsersTable />
    </Layout>
  </Provider>,
  document.querySelector("#root")
);
```



## 其他

1. 详细案例  redux-saga-model [在线案例](https://tomsontang.github.io/redux-saga-model-tutorial/users-demo/build/index.html)
2. 配合 redux-saga-model [使用指南](https://github.com/tomsonTang/redux-saga-model-tutorial)

