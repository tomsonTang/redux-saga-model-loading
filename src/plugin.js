import {
  isFSA
} from "flux-standard-action";

const SHOW = "@SAGAMODEL_LOADING/SHOW";
const HIDE = "@SAGAMODEL_LOADING/HIDE";
const NAMESPACE = "loading";
const LOADING = "LOADING";

const META = {
  [LOADING]: true
}

function createLoading(opts = {}) {
  const namespace = opts.namespace || NAMESPACE;
  let initialState = {
    global: false,
    models: {}
  };

  return {
    onSaga(prevSaga, {
      put
    }, model, actionType) {
      return function* (action) {
        if (isFSA(action)) {
          const {
            meta = {}
          } = action;
          const {
            namespace
          } = model;
          if (meta[LOADING]) {
            const saga = actionType.substr(actionType.lastIndexOf("/") + 1);

            yield put({
              type: SHOW,
              payload: {
                namespace,
                saga
              }
            });
            yield prevSaga(action);
            yield put({
              type: HIDE,
              payload: {
                namespace,
                saga
              }
            });
          } else {
            yield prevSaga(action);
          }
        } else {
          yield prevSaga(action);
        }
        return;
      };
    },
    extraReducers: {
      [NAMESPACE](state, action) {
        let sagaNamespace, namespaceWithSagaRegExp;

        const {
          type,
          payload
        } = action;

        switch (type) {
          case SHOW:
            sagaNamespace = `${payload.namespace}/${payload.saga}`;
            namespaceWithSagaRegExp = RegExp(`${payload.namespace}\/\\w+$`);

            initialState = {
              global: true,
              models: {
                ...state.models,
                [payload.namespace]: true,
                [sagaNamespace]: true
              }
            }
            break;

          case HIDE:
            sagaNamespace = `${payload.namespace}/${payload.saga}`;
            namespaceWithSagaRegExp = RegExp(`${payload.namespace}\/\\w+$`);
            // 计算当前带 saga 名称的 namespace 的个数
            const namespaceShowNum = Object.keys(
              state.models
            ).reduce((num, key) => {
              return (namespaceWithSagaRegExp.test(key) && state.models[key]) && ++num, num;
            }, 0);

            // 如果比一个多就证明还存在其他的 saga 在 loading
            const namespaceStatu = namespaceShowNum > 1 ? true : false;

            const models = {
              ...state.models,
              [payload.namespace]: namespaceStatu,
              [sagaNamespace]: false
            };
            const global = Object.keys(models).some(namespace => {
              return models[namespace];
            });

            initialState = {
              global,
              models
            }
            break;

          default:
            break;
        }
        return initialState;
      }
    },
  };
}

export {
  createLoading,
  LOADING,
  META
};

export default createLoading();
