import loadingCol from './loadingCol'
import produce from 'immer'

const SHOW = '@@REDUXTHUNK_LOADING/SHOW';
const HIDE = '@@REDUXTHUNK_LOADING/HIDE';
const TAKELATEST_ADD = '@@REDUXTHUNK_LOADING/TAKELATEST_ADD';
const TAKELATEST_DESTROY = '@@REDUXTHUNK_LOADING/TAKELATEST_DESTROY';

const initState = { takeLatest: {} }

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
      let num = draftState.takeLatest[name] || 0
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
  // action: { name, thunk, takeType }
  const { dispatch, getState } = store
  if (action && typeof action === 'function') {
    const { name, takeType } = config
    if (name) {
      dispatch({ type: SHOW, payload: { name } })
      const nAction = { name, thunk: action, takeType }
      loadingCol({
        action: nAction, store, callback: () => {
          dispatch({ type: HIDE, payload: { name } })
        }
      })
      return
    }
    loadingCol({
      action: { thunk: action }, store, callback: () => {
        dispatch({ type: HIDE, payload: { name } })
      }
    })

    return

  }
  return next(action);
}
