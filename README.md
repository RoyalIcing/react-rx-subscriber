# react-rx-subscriber

Allows your pure React components to subscribe to Rx Observables by transforming
them into props.

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

An observable of some sort, this example loads JSON, but yours can do whatever
you like.

```javascript
// services/list.js
import Rx from 'rx-lite';
import fetch from 'whatwg-fetch';

const listSubject = ReplaySubject(1);
export const listObservable = listSubject.asObservable();

export function loadList() {
  Rx.Observable.fromPromise(
    fetch('/list.json')
  ).subscribe(listSubject);
}
```

Subscribe to the observable and transform its value into the prop `items`.
Shows a spinner until items are ready:

```javascript
// containers/list.js
import React from 'react';
import subscriber from 'react-rx-subscriber';
import pending from 'react-pending';
import Spinner from 'react-spinner';

import List from '../components/List';
import { listObservable } from '../services/list';

const PendingList = (props) => !!props.items ? <List { ...props } /> : <Spinner />;

export default subscriber([
  listObservable.map(items => ({ items })),
])(PendingList);
```

```javascript
<PendingList />
```

---

Dynamic observables that depend on the inputted props are also supported:

```javascript
// services/list.js

//...

export function observableForListWithID(id) {
  return Rx.Observable.fromPromise(
    fetch(`/list/${id}`)
  );
}
```

```javascript
// containers/list.js
import React from 'react';
import subscriber from 'react-rx-subscriber';
import Spinner from 'react-spinner';

import List from '../components/List';
import { observableForListWithID } from '../services/list';

const PendingList = (props) => !!props.items ? <List { ...props } /> : <Spinner />;

export default subscriber(({ id }) => [
  observableForListWithID(id).map(items => ({ items })),
])(PendingList);
```

```javascript
<PendingList id={ '123' } />
```

## Installation

```sh
npm install react-rx-subscriber --save
```
