import { isFSA } from "flux-standard-action";

const SHOW = "@SAGAMODEL_LOADING/SHOW";
const HIDE = "@SAGAMODEL_LOADING/HIDE";
const NAMESPACE = 'loading';
const LOADING = 'LOADING'

function createLoading(opts = {}) {
  const namespace = opts.namespace || NAMESPACE;
  const initialState = {
    global: false,
    models: {}
  };

  return {
    onSaga(prevSaga, { put }, model, actionType) {
      return function*(action) {
        if (isFSA(action)) {
          const { meta = {} } = action;
          const { namespace } = model;
          if (meta[LOADING]) {
            yield put({ type: SHOW, payload: { namespace } });
            yield prevSaga(action);
            yield put({ type: HIDE, payload: { namespace } });
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
      [namespace](state, { type, payload }) {
        let ret;

        switch (type) {
          case SHOW:
            ret = {
              ...state,
              global: true,
              models: {...state.models, [payload.namespace]:true}
            };
            break;

          case HIDE:
          const models = {...state.models, [payload.namespace]: false};
          const global = Object.keys(models).some((namespace)=>{
            return models[namespace];
          });
          ret = {
            ...state,
            global,
            models,
          };
          break;

          default:
            ret = initialState;
        }
        return ret;
      }
    }
  };
}

export { createLoading,LOADING };

export default createLoading();
