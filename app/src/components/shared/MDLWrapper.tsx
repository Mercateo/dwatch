import React, { Component, Children } from 'react';
import { findDOMNode } from 'react-dom';

declare var window: any;

export class MDLWrapper extends Component<void, void> {
  componentDidMount() {
    window.componentHandler.upgradeElement(findDOMNode(this));
  }

  componentWillUnmount() {
    window.componentHandler.downgradeElements(findDOMNode(this));
  }

  render() {
    return Children.only(this.props.children);
  }
}
