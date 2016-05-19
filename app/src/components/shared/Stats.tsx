import React from 'react';
import { DockerStreamComponent } from './DockerStreamComponent';
import { observable } from 'mobx/lib/mobx';
import { observer } from 'mobx-react/index';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { parseBytes } from '../../utils/Helper';
import { ContainerModel, CONTAINER_RUN_STATE } from '../../models/ContainerModel';

const styles = require('./Common.css');

interface StatsStreamData {
  read: string;
  memory_stats: {
    limit: number;
    max_usage: number;
    usage: number;
  },
  cpu_stats: {
    cpu_usage: {
      total_usage: number
    },
    system_cpu_usage: number
  }
}

interface StatsProps {
container: ContainerModel;
}

@observer
export class Stats extends DockerStreamComponent<StatsStreamData, StatsProps, {}> {
  @observable
  private totalMemory: number = 0;

  @observable
  private usedMemory: number = 0;

  @observable
  private cpuUsage: number = 0;

  private oldTotalCpuUsage: number = 0;
  private oldSystemCpuUsage: number = 1;

  componentWillMount (): Promise<void> {
    return this.loadStream(this.props);
  }

  componentWillReceiveProps (nextProps: StatsProps): Promise<void> {
    return this.loadStream(nextProps);
  }

  private async loadStream(props: StatsProps) {
    if (props.container == null || (props.container != null && props.container.state.runState !== CONTAINER_RUN_STATE.RUNNING)) {
      this.destroyStream();
      return;
    }

    if (props.container.state.runState === CONTAINER_RUN_STATE.RUNNING) {
      this.attachStream(await this.props.container.stats());
    }
  }

  render () {
    const { container } = this.props;
    const usedMemory = parseBytes(this.usedMemory);
    const totalMemory = parseBytes(this.totalMemory);

    if (container != null && container.state.runState === CONTAINER_RUN_STATE.RUNNING) {
      return (
        <div>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="stats.cpu"/></li>
            <li>
              <strong><FormattedNumber value={this.cpuUsage} style='percent'/></strong>
            </li>
          </ul>

          <ul className={`${styles.inlineList}`}>
            <li><FormattedMessage id="stats.memory"/></li>
            <li>
              <strong><FormattedNumber value={usedMemory.size}/>{ ' ' + usedMemory.unit } / <FormattedNumber
                value={totalMemory.size}/>{ ' ' + totalMemory.unit }</strong>
            </li>
          </ul>
        </div>
      );
    } else {
      return <p><FormattedMessage id="no-data-available"/></p>;
    }
  }

  onData (data: StatsStreamData): void {
    // onData gets called every second, so we could simply do this:
    this.cpuUsage = ((data.cpu_stats.cpu_usage.total_usage - this.oldTotalCpuUsage) / (data.cpu_stats.system_cpu_usage - this.oldSystemCpuUsage));

    this.oldSystemCpuUsage = data.cpu_stats.system_cpu_usage;
    this.oldTotalCpuUsage = data.cpu_stats.cpu_usage.total_usage;

    this.totalMemory = data.memory_stats.limit;
    this.usedMemory = data.memory_stats.usage;
  }

  onError (err: any): void {
    console.log(err);
  }
}
