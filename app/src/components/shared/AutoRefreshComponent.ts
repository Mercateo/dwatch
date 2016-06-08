import React, { Component } from 'react';

export abstract class AutoRefreshComponent<P, S> extends Component<P, S> {
  // TODO: fix this any
  // this should be a number in browsers and a NodeJS.Timer in node environment...but TS compiler is confused about it
  private intervalHolder: any = null;

  getInterval(): number {
    return 1000;
  }

  componentWillMount () {
    this.intervalHolder = setInterval(() => this.tick(), this.getInterval() || 1000);
  }

  componentWillUnmount() {
    this.clearInterval();
  }

  clearInterval() {
    clearInterval(this.intervalHolder);
  }

  abstract tick(): any;
}
