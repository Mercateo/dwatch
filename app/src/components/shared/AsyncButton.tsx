import React, { Component, HTMLProps, MouseEvent } from 'react';
import { observable } from 'mobx/lib/mobx';
import { observer } from 'mobx-react/index';
import { MDLWrapper } from './MDLWrapper';
import { inject } from '../../utils/IOC';
import { UiStore } from '../../stores/UiStore';

@observer
export class AsyncButton extends Component<HTMLProps<HTMLButtonElement>, {}> {
  @inject(UiStore)
  private uiStore: UiStore;

  @observable
  private isLoading: boolean = false;

  render() {
    return (
      <button
        { ...this.props }
        disabled={this.props.disabled || this.isLoading}
        onClick={!this.isLoading ? this.handleClick : null}>
        {this.renderContent() }
      </button>
    );
  }

  private renderContent() {
    if (this.isLoading) {
      return (
        <MDLWrapper>
          <div className="mdl-spinner mdl-js-spinner is-active"></div>
        </MDLWrapper>
      );
    } else {
      return this.props.children;
    }
  }

  private handleClick = async (event: MouseEvent) => {
    const finishTask = this.uiStore.startAsyncTask();

    this.isLoading = true;

    try {
      await this.props.onClick(event);
      finishTask();
    } catch (e) {
      finishTask(e);
    } finally {
      this.isLoading = false;
    }
  };
}
