import React, { Component } from 'react';

const styles = require('./Common.css');

interface TwoColumnCardRowProps {
  label: string | JSX.Element;
  content: string | JSX.Element;
}

export class TwoColumnCardRow extends Component<TwoColumnCardRowProps, void> {
  render() {
    return (
      <div className="mdl-grid mdl-grid--no-spacing" style={{marginBottom: '8px', marginTop: '8px'}}>
        <div className={`mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone ${styles.wrap}`}>
          {this.props.label}
        </div>
        <div className={`mdl-cell mdl-cell--12-col mdl-cell--12-col-tablet mdl-cell--12-col-phone ${styles.wrap}`}>
          {this.props.content}
        </div>
      </div>
    );
  }
}
