import React from 'react';
import Rx from 'rx-lite';
import isFunction from 'lodash.isfunction';

class SubscriberWrapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  subscribeOnNext(observable) {
    this.disposable.add(
      observable.subscribeOnNext((stateChanges) => {
        if (stateChanges) {
          this.setState(stateChanges);
        }
      })
    );
  }

  subscribeToObservables(props) {
    if (this.disposable) {
      this.disposable.dispose();
    }

    this.disposable = new Rx.CompositeDisposable();

    let { observables: resolvedObservables, transformObservable, forwardedProps } = props;

    if (isFunction(resolvedObservables)) {
      this.propsSubject = new Rx.Subject();
      resolvedObservables = resolvedObservables(this.propsSubject.asObservable());
    }

    resolvedObservables.forEach(observable => {
      this.subscribeOnNext(transformObservable(observable));
    });

    if (this.propsSubject) {
      this.propsSubject.onNext(props);
    }
  }

  componentDidMount() {
    this.subscribeToObservables(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.propsSubject) {
      this.propsSubject.onNext(nextProps);
    }
  }

  componentWillUnmount() {
    this.disposable.dispose();
  }

  render() {
    const { component: Component, forwardedProps } = this.props;
    return (
      <Component { ...forwardedProps } { ...this.state } />
    );
  }
}

function reflect(input) {
  return input;
}

export default function subscriber(observables, { transformObservable = reflect } = {}) {
  return (Component) => (props) => (
    <SubscriberWrapper forwardedProps={ props } observables={ observables } transformObservable={ transformObservable } component={ Component } />
  );
}
