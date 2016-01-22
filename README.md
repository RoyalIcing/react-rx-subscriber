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
