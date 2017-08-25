import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Rx';
import { Logger } from 'angular2-logger/app/core/logger';
import { LogService } from '../log.service';
import {StandupService } from './standup.service';
import { PageComponent } from '../page.component';
import { CollapsiblePanelComponent } from '../shared/collapsible-panel.component';
//import { CollapsibleSubPanelComponent } from '../shared/collapsible-sub-panel.component';

@Component({
	selector: 'standup',
	templateUrl: './standup.component.html',
 	styleUrls: []
})

@Injectable()
export class StandupComponent  {
	log: LogService;
	standupService: StandupService;
	timer: Observable<number>;

	interval: number = 60;
	counter: number = 0;
  offset: number = 0;
  paused: boolean = false;
	currentValue: number = this.interval;
	percentage: number = 0;
	currentDisplay: string = "Not Started";
  timerStarted: boolean = false;
  color: string = "status_green";
  pauseButtonCaption = "Pause";
  yellowThreshold: number = 8;
  redWarningThreshold: number = 3;
  personCounter: number = 0;
  nextSound: number = 1;


	constructor(private _logger: LogService,
	            private _standupService: StandupService,
	            private _pageComp: PageComponent) {
		this.log = _logger;
		this.log.info('StandupService.constructor() BEGIN');
		this.standupService = _standupService;


		// Set up page data.
    _pageComp.closeHamburgerMenu();
		_pageComp.pageName = 'Daily Standup';
		_pageComp.subTitle = 'Allows teams to use a visual timer during standup that can be visible over screenshare.';

    this.timer = Observable.timer(0,1000);
	}

	start() {
	  this.personCounter++;
	  let adj = 0;
	  if (this.personCounter > 1) {
	    adj = 1;
    }
	  if (! this.timerStarted) {
	    this.timerStarted = true;
      this.timer.subscribe(t=>{
        this.counter = t;
        if (! this.paused) {
          this.currentValue = (this.interval + adj) - (this.counter - this.offset);
          this.percentage = Math.floor(((this.interval-this.currentValue)/this.interval)*100);
          this.updateDisplay(this.currentValue);
          this.log.info('StandupService.timer -> ' + this.currentDisplay + " - " + this.percentage + "%   Calc: (" + this.interval + " - " + this.currentValue + ") / " + this.interval + ")");
        } else {
          this.offset++;
        }
      });
    }
    this.paused = false;
    this.offset = this.counter;
	  this.color = "status_green";
    this.currentValue = (this.interval + adj) - (this.counter - this.offset);
    this.updateDisplay(this.currentValue);
  }

  pause() {
	  if (this.paused) {
	    // resume
      this.paused = false;
      this.pauseButtonCaption = "Pause";

    } else {
	    // payuse
      this.paused = true;
      this.pauseButtonCaption = "Resume";
    }
  }

  stop() {
	  this.currentDisplay = "Not Started";
	  this.paused = true;
  }

  updateDisplay(num: number) {
	  if (num > this.interval) {
	    num = this.interval;
    }
    if (num <= 0) {
      num = 0;
      this.percentage = 100;
      this.color = "status_red";
      this.playSound();
      this.paused = true;
    } else if (num <= this.redWarningThreshold) {
      this.color = "status_red";
      this.log.info('StandupService.updateDisplay()  < 3 secs remaining.  Setting to red, should revert to yellow in 200ms.');
      setTimeout(() => {
        this.log.info('StandupService.timeout callback ->  Reverting to yellow now.');
        this.color = "status_yellow";
      }, 200);
    } else if (num <= this.yellowThreshold) {
	    this.color = "status_yellow";
    }
    let min = Math.floor(num/60);
    var seconds = num % 60;
    this.currentDisplay = min + ":" + this.pad(seconds, 2);
  }

  pad(num, size) : string {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }

  playSound() {
    let a = new Audio();
    a.src = "/scrumworks/assets/mp3/failure" + this.nextSound + ".mp3";
    a.load();
    a.play();
    this.nextSound++;
    if (this.nextSound > 4) {
      this.nextSound = 1;
    }
    this.log.info('StandupService.playSound() Playing Failure Audio file #' + this.nextSound + '.');
  }

}
