import loadingCol from './loadingCol'
import produce from 'immer'

const SHOW = '@@REDUXTHUNK_LOADING/SHOW';
const HIDE = '@@REDUXTHUNK_LOADING/HIDE';
const TAKELATEST_ADD = '@@REDUXTHUNK_LOADING/TAKELATEST_ADD';
const TAKELATEST_DESTROY = '@@REDUXTHUNK_LOADING/TAKELATEST_DESTROY';

const initState = { takeLatest: {} }

const handleAction = async ({ thunk, name, takeType }, store, dispatch) => {
  if (name) {
    dispatch({ type: SHOW, payload: { name } })

    return loadingCol({
      action: { thunk, name, takeType },
      store,
      callback: () => {
        dispatch({ type: HIDE, payload: { name } })
      },
    })
  }
  return loadingCol({
    action: { thunk },
    store,
    callback: () => {
      dispatch({ type: HIDE, payload: { name } })
    },
  })
}

export const loadingReducer = produce((draftState = initState, action) => {
  const { type, payload = {} } = action
  const { name } = payload
  switch (type) {
    case SHOW:
      draftState[name] = true
      break;
    case HIDE: {
      draftState[name] = false
      break;
    }
    case TAKELATEST_ADD:
      const num = draftState.takeLatest[name] || 0
      draftState.takeLatest[name] = num + 1
      break;
    case TAKELATEST_DESTROY:
      delete draftState.takeLatest[name]
      break;
    default:
      return draftState
  }
})

export const reduxThunkLoading = store => next => async (action, config = {}) => {
  const { dispatch } = store
  if (action && typeof action === 'function') {
    const { name, takeType } = config
    return handleAction({ name, takeType, thunk: action }, store, dispatch)
  }
  if (action && action.thunk && !action.type) {
    // action: { name, thunk, takeType }

    return handleAction(action, store, dispatch)
  }
  next(action);
}

