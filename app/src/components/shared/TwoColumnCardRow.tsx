import React, { Component } from 'react';

const styles = require('./Common.css');

interface TwoColumnCardRowProps {
  left: string | JSX.Element;
  right: string | JSX.Element;
  besides?: boolean;
}

export class TwoColumnCardRow extends Component<TwoColumnCardRowProps, {}> {
  render () {
    const width = this.props.besides ? 6 : 12;
    const customStyles = {
      marginBottom: !this.props.besides ? '8px' : null,
      marginTop: !this.props.besides ? '8px' : null
    };

    return (
      <div className="mdl-grid mdl-grid--no-spacing " style={customStyles}>
        <div className={`mdl-cell mdl-cell--${width}-col ${styles.wrap} ${styles.firstWithoutMargin} ${styles.lastWithoutMargin}`}>
          {this.props.left}
        </div>
        <div className={`mdl-cell mdl-cell--${width}-col ${styles.wrap} ${styles.firstWithoutMargin} ${styles.lastWithoutMargin}`}>
          {this.props.right}
        </div>
      </div>
    );
  }
}
