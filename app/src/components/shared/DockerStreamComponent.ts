import React, { Component } from 'react';
import { dockerStream } from '../../utils/Helper';

export abstract class DockerStreamComponent<StreamData, P, S> extends Component<P, S> {
  private stream: any = null;

  attachStream(stream: any) {
    this.destroyStream();

    this.stream = stream;

    dockerStream(stream, (err) => {
      if(err) {
        this.onError(err);
      }
    }, (data: StreamData) => {
      this.onData(data);
    })
  }

  isStreamAttached() {
    return this.stream != null;
  }

  destroyStream() {
    if(this.stream != null) {
      this.stream.destroy();
      this.stream = null;
    }
  }

  componentWillUnmount() {
    this.destroyStream();
  }

  abstract onData(data: StreamData): void;

  abstract onError(err: any): void;
}
