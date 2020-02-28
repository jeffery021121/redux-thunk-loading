# redux-thunk-loading

> redux-thunk-loading is a redux middleware which could add or cancel loading state automatically. it also has takeLatest function which is the same as redu-saga,with redux-thunk-loading,you do not need redux-thunk anymore

## install

```
npm i redux-thunk-loading --save
```

## usage

> add the extraReducer and middleware

```js
// root.js
import { reduxThunkLoading, loadingReducer } from "redux-thunk-loading";

let reducers = combineReducers({ loadingReducer });
let store = createStore(reducers, applyMiddleware(reduxThunkLoading));
```

> asynchronous request with redux-thunk-loading is just like redux-thunk

in this example,loading will transfomate automatically.
loading 'false'=>'true'=>'false'

1. loadingReducer is the etraReducer name
2. handelThunkALoading is the name we redist on click event
3. the function that handelThunkA returns could be a generator function of async function.

```js
// pageA.jsx

const handelThunkA = () =>
  function*(dispatch, getState) {
    const result = yield fetch("http://localhost:3001/helloworld", {
      method: "GET"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        return myJson;
      });
    console.log("redult:", result);
    dispatch({ type: "updateState", payload: { ...result } });
  };

class APage extends React.Component {
  handleClick = () => {
    this.props.dispatch(handelThunkA);
  };

  render() {
    return (
      <div>
        <p>the same usage as redux-thunk</p>
        <button
          onClick={() => {
            this.props.dispatch(handelThunkA);
          }}
        >
          test me
        </button>
        <p>with second argument config we could use loading state</p>
        <button
          onClick={() => {
            this.props.dispatch(handelThunkA(), {
              name: "handelThunkALoading"
            });
          }}
        >
          test me
        </button>
        loading:
        {this.props.state.loadingReducer.handelThunkALoading ? "true" : "false"}
      </div>
    );
  }
}
```
> usage in actionFile
```
dispatch({ thunk: getTableData(param), name: tableLoading })
```

## what is takeLatest

> when you have multiple requests in a short time, and the result what you need is from the latest request.Maybe the second result comes back latest. In this time ,you need takeLatest which chould cancel other actions and keep the result is from the latest request.

in this example ,the function that handelThunkA returns should be a generator function.
when we click the button multiple times in a short time,loading will be 'false'=>'true'=>'false'.but in previous example, it will change many times.

```js
// pageA.jsx

const handelThunkA = () =>
  function*(dispatch, getState) {
    const result = yield fetch("http://localhost:3001/helloworld", {
      method: "GET"
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        return myJson;
      });
    console.log("redult:", result);
    dispatch({ type: "updateState", payload: { ...result } });
  };

class APage extends React.Component {
  handleClick = () => {
    this.props.dispatch(handelThunkA);
  };

  render() {
    return (
      <div>
        <p>the same usage as redux-thunk</p>
        <button
          onClick={() => {
            this.props.dispatch(handelThunkA);
          }}
        >
          test me
        </button>
        <p>with second argument config we could use loading state</p>
        <button
          onClick={() => {
            this.props.dispatch(handelThunkA(), {
              name: "handelThunkALoading",
              takeType: "takeLatest"
            });
          }}
        >
          test me
        </button>
        loading:
        {this.props.state.loadingReducer.handelThunkALoading ? "true" : "false"}
      </div>
    );
  }
}
```
learn more example : [jeffery021121/redux-loading](https://github.com/jeffery021121/redux-loading)

