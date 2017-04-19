import { Component, ViewChild } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import * as RecordRTC from 'recordrtc';
import * as Dropbox from 'dropbox';

const ACCESS_TOKEN = "TgMlERqZcOAAAAAAAAAAIKm0VIZKVNm-txpvtd_Rq5C283tlb2V5p_6ORggGL49F";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video') video: any
  private stream: any;
  private recordRTC: RecordRTC;
  private box: Dropbox;

  constructor(http: Http) {
    this.box = new Dropbox({ accessToken: ACCESS_TOKEN })
  }

  public ngAfterViewInit(): void {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  public startRecording(): void {
    let mediaConstraints = {
      audio: true
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

  public upload(): void {
    var recordedBlob = this.recordRTC.getBlob();
    let name = `video_${Math.random().toString().slice(3)}.webm`;
    this.box.filesUpload({ path: '/' + name, contents: recordedBlob })
      .then()
      .catch((error) => {
        console.error(error);
      });
  }
}
