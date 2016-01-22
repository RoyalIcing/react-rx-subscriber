# react-rx-subscriber

Allows your pure React components to subscribe to Rx Observables by transforming
them into props.

## Example

```javascript
// components/List.js

export default function List({ items }) {
  return (
    <ul>
      { items.map(({ title }) => <li>{ title }</li>) }
    </ul>
  );
}
```

Subscribe to an observable and transform its value into the prop `items`.
As `items` will initially be `undefined`, show a spinner until they are ready:

```javascript
// containers/list.js
import React from 'react';
import subscriber from 'react-rx-subscriber';
import Spinner from 'react-spinner';

import List from '../components/List';
import { listObservable } from '../services/list';

const PendingList = (props) => !!props.items ? <List { ...props } /> : <Spinner />;

export default subscriber([
  listObservable.map(items => ({ items })),
])(PendingList);
```

```javascript
// Rendering:
<PendingList />
```

---

Dynamic observables that depend on the inputted props are also supported:

```javascript
// containers/list.js
import React from 'react';
import subscriber from 'react-rx-subscriber';
import Spinner from 'react-spinner';

import List from '../components/List';
import { observeListWithID } from '../services/list';

const PendingList = (props) => !!props.items ? <List { ...props } /> : <Spinner />;

export default subscriber(({ observeProp }) => [
  observeProp('id')
    .flatMap(observeListWithID)
    .map(items => ({ items })),
])(PendingList);
```

```javascript
// Rendering:
<PendingList id={ '123' } />
```

## Installation

```sh
npm install react-rx-subscriber --save
```

## API

### `subscriber(observables, { transformObservable })(component)`

Returns a new component that will be subscribed to the passed observables,
rendering using the passed component.
Must be invoked twice (result of first call is a function to which you pass your component).

- `observables` either:
  - An *array of Rx.Observables* to subscribe to.
    Each observable must map to an object with the props that are to be passed.
    e.g. `observeSomething().map(something => ({ propName: something }))`
  - A *function returning an array of Rx.Observables* to subscribe to, again mapping to props.
    The function is passed an object with the signature `({ observeProp, allPropsObservable })`:
    - `observeProp(id)`: *Function* which returns an observable for a particular prop for each unique change.
    - `allPropsObservable`: An *observable* for all props.
- `transformObservable(observable)`: A *function* that will be called for every observable allowing an altered observable to be returned,
e.g. using `.catch()` for error handling.
- `component`: The *React component* you wish to render with the resolved props.
