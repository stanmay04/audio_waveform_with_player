import { AfterViewInit, Component, OnInit, ViewChild, ElementRef ,Renderer2 } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import WaveSurfer from 'wavesurfer.js';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit,OnInit  {
  @ViewChild('inputField') inputField!: ElementRef;
  title = 'assignment';
  contests = false;
  matches = false;
  displayedColumns: string[] = ['option', 'radar', 'falcon', 'sinlimit','sinrisk', 'sinbet', 'stake', 'pnl', 'multirisk', 'multidist'];
  dataSource = new MatTableDataSource<any>();
  // sports: Sport[] = [
  //   {
  //     name: 'Cricket',
  //     contests: [
  //       { name: 'IPL', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },
  //   {
  //     name: 'Football',
  //     contests: [
  //       { name: 'FIFA', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },  {
  //     name: 'Cricket',
  //     contests: [
  //       { name: 'IPL', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },
  //   {
  //     name: 'Football',
  //     contests: [
  //       { name: 'FIFA', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },  {
  //     name: 'Cricket',
  //     contests: [
  //       { name: 'IPL', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },
  //   {
  //     name: 'Football',
  //     contests: [
  //       { name: 'FIFA', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },  {
  //     name: 'Cricket',
  //     contests: [
  //       { name: 'IPL', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },
  //   {
  //     name: 'Football',
  //     contests: [
  //       { name: 'FIFA', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },  {
  //     name: 'Cricket',
  //     contests: [
  //       { name: 'IPL', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },
  //   {
  //     name: 'Football',
  //     contests: [
  //       { name: 'FIFA', matches: ['Match 1', 'Match 2'] }
  //     ]
  //   },
  // ];
  data:any;
  selectedRow: any;

  
  // constructor() {
  // }
  ngOnInit(): void {
    this.data=ELEMENT_DATA;
    this.dataSource = new MatTableDataSource(ELEMENT_DATA);
console.log(this.dataSource);
// this.loadVideo();
  }
  // ngAfterViewInit() {
  //   this.removeExpansionPanelBodyPadding();
  // }

  removeExpansionPanelBodyPadding() {
    const expansionPanelBodies = document.getElementsByClassName('mat-expansion-panel-body');
    for (let i = 0; i < expansionPanelBodies.length; i++) {
      const expansionPanelBody = expansionPanelBodies[i] as HTMLElement;
      expansionPanelBody.style.padding = '0';
    }
  }
  toggleEditMode(element: any) {
    this.dataSource.data.forEach(item => item.editMode = false); // Close edit mode for all elements
    element.editMode = true; // Open edit mode for the clicked element
    setTimeout(() => this.inputField.nativeElement.focus()); // Set focus on the input after a short delay
  }
  
  navigate(direction: string, element: any) {
    const index = this.dataSource.data.indexOf(element);
  
    if (direction === 'up' && index > 0) {
      const previousElement = this.dataSource.data[index - 1];
      this.toggleEditMode(previousElement); // Toggle edit mode for previous element
    } else if (direction === 'down' && index < this.dataSource.data.length - 1) {
      const nextElement = this.dataSource.data[index + 1];
      this.toggleEditMode(nextElement); // Toggle edit mode for next element
    }
  }
 
  saveAndToggleEditMode(element: any) {
    element.editMode = false;
    setTimeout(() => this.inputField.nativeElement.focus());
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
  }

  moveOneFrameBackward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      const frameRate = 30; // Assuming a frame rate of 30 frames per second
      this.videoPlayer.nativeElement.currentTime = currentTime - (1 / frameRate);
    }
  }

  moveOneSecondForward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      this.videoPlayer.nativeElement.currentTime = currentTime + 1;
    }
  }

  moveOneSecondBackward() {
    if (this.videoPlayer.nativeElement.readyState === 4) {
      const currentTime = this.videoPlayer.nativeElement.currentTime;
      this.videoPlayer.nativeElement.currentTime = currentTime - 1;
    }
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
export interface Sport {
  name: string;
  contests: Contest[];
}

export interface Contest {
  name: string;
  matches: string[];
}

export interface PeriodicElement {
  option: string;
  radar: string;
  falcon: string;
  sinlimit: string;
  sinrisk: string;
  sinbet: string;
  stake: string;
  pnl: string;
  multirisk: string;
  multidist: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {option: "1", radar: 'Hydrogen', falcon: "1.0079", sinlimit: 'H',sinrisk: 'H',sinbet: 'H',stake: 'H',pnl: 'H',multirisk: 'H',multidist: 'H',},
  {option: "2", radar: 'Helium', falcon: "4.0026", sinlimit: 'He',sinrisk: 'H',sinbet: 'H',stake: 'H',pnl: 'H',multirisk: 'H',multidist: 'H',},
];