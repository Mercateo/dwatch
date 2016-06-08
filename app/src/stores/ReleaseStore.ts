import { provideSingleton, inject, Fetch } from '../utils/IOC';
import { observable } from 'mobx/lib/mobx';
import { UiStore } from './UiStore';
import { SettingsStore } from './SettingsStore';

declare var __VERSION__: any;

interface GithubRelease {
  id: number;
  name: string;
}

@provideSingleton(ReleaseStore)
export class ReleaseStore {
  private intervalHolder: any = null;

  @inject(UiStore)
  private uiStore: UiStore;

  @inject(SettingsStore)
  private settingsStore: SettingsStore;

  @inject(Fetch)
  private fetch: typeof window.fetch;

  @observable
  newVersion: string;

  currentVersion: string = __VERSION__;

  constructor () {
    setTimeout(() => this.checkForUpdate(), 5000);
    this.intervalHolder = setInterval(() => this.checkForUpdate(), 60 * 50 * 1000);
  }

  async checkForUpdate (): Promise<void> {
    if (!this.settingsStore.showUpdateNotifications) {
      return;
    }

    const finishTask = this.uiStore.startAsyncTask();
    let releases: Array<GithubRelease> = [];

    // fail silently because github has a request limit
    try {
      releases = await(await this.fetch('https://api.github.com/repos/Mercateo/dwatch/releases')).json<Array<GithubRelease>>();
    } catch(e) {
    }

    // sort by id ASC
    releases
      .sort((a, b) => a.id - b.id)
      .reverse();

    let latestRelease = releases[0];
    if (latestRelease && latestRelease.name !== this.currentVersion) {
      this.newVersion = latestRelease.name;

      if (this.intervalHolder != null) {
        clearInterval(this.intervalHolder);
      }
    }

    finishTask();
  }
}
