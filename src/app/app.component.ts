import { Component, ViewChild } from '@angular/core';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video') video: any
  private stream: any;
  private recordRTC: RecordRTC;

  public ngAfterViewInit(): void {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  public startRecording(): void {
    let mediaConstraints = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720
        }
      }, audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this));
  }

  private successCallback(stream: MediaStream) {
    var options = {
      mimeType: 'video/webm',
      bitsPerSecond: 128000
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    this.toggleControls();
  }

  private toggleControls(): void {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  public stopRecording(): void {
    this.recordRTC.stopRecording(this.processVideo.bind(this));
    this.stream.getAudioTracks().forEach(track => track.stop());
    this.stream.getVideoTracks().forEach(track => track.stop());
  }

  public processVideo(audioVideoWebMURL): void {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = audioVideoWebMURL;
    this.toggleControls();
  }

  public download(): void {
    var recordedBlob = this.recordRTC.getBlob();
    this.recordRTC.getDataURL((dataURL) => { console.log(recordedBlob) });
    /*this.recordRTC.save('video.webm');*/
  }
}
