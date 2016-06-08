import React, { Component } from 'react';

const styles = require('./Common.css');

interface TwoColumnCardRowProps {
  left: string | JSX.Element;
  right: string | JSX.Element;
  besides?: boolean;
}

export class TwoColumnCardRow extends Component<TwoColumnCardRowProps, void> {
  render() {
    const width = this.props.besides ? 6 : 12;

    return (
      <div className="mdl-grid mdl-grid--no-spacing" style={{marginBottom: '8px', marginTop: '8px'}}>
        <div className={`mdl-cell mdl-cell--${width}-col ${styles.wrap}`}>
          {this.props.left}
        </div>
        <div className={`mdl-cell mdl-cell--${width}-col ${styles.wrap}`}>
          {this.props.right}
        </div>
      </div>
    );
  }
}
