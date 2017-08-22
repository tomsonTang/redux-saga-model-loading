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

#### index.js

```jsx
import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux'
import "antd/dist/antd.css";

import loading from 'redux-saga-model-loading';
import sagaModel from "reudx-saga-model";
import Layout from "./view/Layout.jsx";
import UsersTable from "./view/UsersTable.jsx";

//加载插件
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

#### component.js

```jsx
import React from "react";
import { Table, Input, Icon, Button, Popconfirm } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { namespace as dbNamespace } from "../../db/dataModel.js";
import * as action from "../../action.js";
const columns = [
    //...
];

class EditableTable extends React.Component {
  constructor(props) {}

  componentWillMount = () => {
    this.props.getUsers();
  };

  render() {
    const { dataSource,loading } = this.props;

    const columns = this.columns;
    return (
      <div>
        <Table bordered dataSource={dataSource} columns={columns} loading={loading}/>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(action, dispatch);
};

const mapStateToProps = state => {
  const usersState = state[dbNamespace];

  return {
    dataSource: usersState.list,
    count: usersState.count,
    // 获取对应 namespace 下的 loading 状态
    loading:state.loading.models[dbNamespace]
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditableTable);
```

#### action.js

```javascript
import {LOADING} from 'redux-saga-model-loading'

export const getUsers = ()=>{
  return {
    type:'users/db/getUsers',
    payload:{},
    //告诉插件为 users/db/getUsers 这个副作用开启 loading
    meta:{ [LOADING]:true }
  }
}
```



![](https://raw.githubusercontent.com/tomsonTang/redux-saga-model-tutorial/master/assets/loading.png)

## 其他

1. 详细案例  redux-saga-model [在线案例](https://tomsontang.github.io/redux-saga-model-tutorial/users-demo/build/index.html)
2. 配合 redux-saga-model [使用指南](https://github.com/tomsonTang/redux-saga-model-tutorial)

