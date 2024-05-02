import { AfterViewInit, Component, OnInit, ViewChild, ElementRef ,Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import WaveSurfer from 'wavesurfer.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit  {

  ngOnInit(): void {
  }
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  @ViewChild('waveformCanvas') waveformCanvas!: ElementRef;
  isPlaying = true;
  private audioCtx: AudioContext;
  private analyser: AnalyserNode;
  private dataArray: Uint8Array;
  private requestAnimationFrameId!: number;

  constructor() {
    this.audioCtx = new AudioContext();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
  }

  ngAfterViewInit(): void {
    const videoElement = this.videoPlayer.nativeElement;
    const source = this.audioCtx.createMediaElementSource(videoElement);
    source.connect(this.analyser);
    this.analyser.connect(this.audioCtx.destination);

    this.drawWaveform();
  }
  togglePlay() {
    if (this.audioCtx.state === 'suspended') {
      document.addEventListener('click', () => {
        this.audioCtx.resume().then(() => {
        }).catch((error) => {
          console.error('Failed to resume AudioContext:', error);
        });
      }, { once: true }); // Ensure the event listener only triggers once
    }
    if (this.videoPlayer.nativeElement.paused) {
      this.videoPlayer.nativeElement.play();
    } else {
      this.videoPlayer.nativeElement.pause();
    }
    this.isPlaying = !this.isPlaying;
  }
  moveOneFrameForward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      const frameRate = 30; // Assuming a frame rate of 30 frames per second
      this.videoPlayer.nativeElement.currentTime = currentTime + (1 / frameRate);
    }
    this.drawWaveform();

  }

  moveOneFrameBackward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      const frameRate = 30; // Assuming a frame rate of 30 frames per second
      this.videoPlayer.nativeElement.currentTime = currentTime - (1 / frameRate);
    }
    this.drawWaveform();

  }

  moveOneSecondForward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      this.videoPlayer.nativeElement.currentTime = currentTime + 1;
    }
    this.drawWaveform();
  }

  moveOneSecondBackward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      this.videoPlayer.nativeElement.currentTime = currentTime - 1;
    }
    this.drawWaveform();

  }
  drawWaveform(): void {
    const canvas = this.waveformCanvas.nativeElement;
    const canvasCtx = canvas.getContext('2d');

    const draw = () => {
      this.analyser.getByteTimeDomainData(this.dataArray);

      canvasCtx.fillStyle = 'rgb(255, 255, 255)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = 'rgb(0, 0, 0)';
      canvasCtx.beginPath();

      const sliceWidth = canvas.width / this.analyser.frequencyBinCount;
      let x = 0;

      for (let i = 0; i < this.analyser.frequencyBinCount; i++) {
        const v = this.dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();

      this.requestAnimationFrameId = requestAnimationFrame(draw);
    };

    draw();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.requestAnimationFrameId);
  }
}
