import { Component, ViewChild, ElementRef } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import * as Dropbox from 'dropbox';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('video') video: ElementRef;
  @ViewChild('tokeninput') token: ElementRef;

  private stream: any;
  private recordRTC: RecordRTC;

  public ngAfterViewInit(): void {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  private toggleControls(): void {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  public startRecording(): void {
    let mediaConstraints = {
      video: {
        mandatory: {
          minWidth: 1280,
          minHeight: 720
        }
      },
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this));
  }

  private successCallback(stream: MediaStream) {
    var options = {
      mimeType: 'video/webm',
      bitsPerSecond: 750000
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
    video.src = window.URL.createObjectURL(stream);
    this.toggleControls();
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
    let key = this.token.nativeElement.value;
    if (key) {      
    let box = new Dropbox({ accessToken: key })
      var recordedBlob = this.recordRTC.getBlob();
      let name = new Date().toUTCString() + '.webm';
      box.filesUpload({ path: '/' + name, contents: recordedBlob })
        .then(
        alert("Video uploaded.")
        )
        .catch((error) => {
          alert(error);
        });
    }
    else {
      alert("Enter dropbox api acces key!");
    }
  }
}
