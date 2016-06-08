import React, { Component } from 'react';
import { observer } from 'mobx-react/index';
import { inject } from '../../utils/IOC';
import { LOCALE, SettingsStore } from '../../stores/SettingsStore';
import { parseLocale } from '../../utils/Helper';
import { action } from 'mobx/lib/mobx';

const styles = require('./../shared/Common.css');

@observer
export class LocaleSwitcher extends Component<void, any> {
  @inject(SettingsStore)
  private settingsStore: SettingsStore;

  render() {
    const supportedLocales = Object.keys(LOCALE)
      .filter(v => isNaN(parseInt(v, 10)))
      .map(x => parseLocale(LOCALE[x]));

    return (
      <div className="mdl-typography--text-center" style={{ marginBottom: '10px' }}>
        <ul className={`${styles.inlineList}`}>
          {supportedLocales.map((locale, index) => (
            <li key={index}>
              <a onClick={this.setLocale(LOCALE[locale.fullLocale.toUpperCase()])} style={{cursor: 'pointer'}}>
                <span className={`flag-icon flag-icon-${locale.country.toLowerCase()}`}></span>
              </a>
            </li>
          )) }
        </ul>
      </div>
    );
  }

  @action
  private setLocale = (locale: LOCALE) => () => {
    this.settingsStore.locale = locale;
  }
}
