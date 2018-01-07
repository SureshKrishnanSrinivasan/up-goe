import { Injectable, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PageService {

  @Output() isProfile: EventEmitter<boolean> = new EventEmitter();
  months: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public lineChartColors: Array<any> = [
    { // light grey
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255,99,132,1)",
      pointBackgroundColor: "rgba(255,99,132,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(255,99,132,0.8)"
    },
    { // grey
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      pointBackgroundColor: 'rgba(54, 162, 235,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(54, 162, 235,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 0.2)',
      pointBackgroundColor: 'rgba(255, 206, 86,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 206, 86,1)'
    },
    { // blue
      backgroundColor: "rgba(151,187,205,0.2)",
      borderColor: "rgba(151,187,205,1)",
      pointBackgroundColor: "rgba(151,187,205,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(151,187,205,0.8)"
    },
    { // red
      backgroundColor: "rgba(247,70,74,0.2)",
      borderColor: "rgba(247,70,74,1)",
      pointBackgroundColor: "rgba(247,70,74,1)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(247,70,74,0.8)"
    },
    { // green
      backgroundColor: "rgba(70,191,189,0.2)",
      borderColor: "rgba(70,191,189,1)",
      pointBackgroundColor: "rgba(70,191,189,1)",
      pointborderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(70,191,189,0.8)"
    },
    { // yellow
      backgroundColor: "rgba(253,180,92,0.2)",
      borderColor: "rgba(253,180,92,1)",
      pointBackgroundColor: "rgba(253,180,92,1)",
      pointborderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(253,180,92,0.8)"
    },
    { // light red
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192,1)",
      pointBackgroundColor: "rgba(75, 192, 192,1)",
      pointborderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(75, 192, 192,0.8)"
    },
    { // yellow
      backgroundColor: "rgba(153, 102, 255, 0.2)",
      borderColor: "rgba(153, 102, 255,1)",
      pointBackgroundColor: "rgba(153, 102, 255,1)",
      pointborderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(153, 102, 255,0.8)"
    },
    { // yellow
      backgroundColor: "rgba(255, 159, 64, 0.2)",
      borderColor: "rgba(255, 159, 64,1)",
      pointBackgroundColor: "rgba(255, 159, 64,1)",
      pointborderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgba(255, 159, 64,0.8)"
    }
  ];

  constructor() { }

  isProfilePage(isProfile) {
    this.isProfile.emit(isProfile);
  }

  /**
	 * Returns the appropriate datetimestring given a date
	 * @param date date to be formatted
	 * 
	 * @returns dateTime string of the formatted date
	 * 
	 * @see formatDate()
	 * @see formatTime()
	 */
  formatDateTime(date: Date): string {
    date = new Date(date);
    let displayDateTime: string = date ?
      this.formatDate(date) + " "
      + this.formatTime(date)
      : "";
    return displayDateTime;
  }

  /**
  * Returns the appropriate datestring given a date object
  * @param date_obj date to be formatted
  * 
  * @returns string of the formatted date
  */
  private formatDate(date_obj) {
    var month = this.months[date_obj.getMonth()];
    var day = date_obj.getDate();
    var year = date_obj.getFullYear();
    let datestring: string = month + " " + day + ", " + year;
    return datestring;
  }

  /**
  * Returns the appropriate timestring given a date object
  * @param date_obj date to be formatted
  * 
  * @returns formatted time string
  */
  private formatTime(date_obj) {
    // formats a javascript Date object into a 12h AM/PM time string
    var hour = date_obj.getHours();
    var minute = date_obj.getMinutes();
    var amPM = (hour > 11) ? "pm" : "am";
    if (hour > 12) {
      hour -= 12;
    } else if (hour == 0) {
      hour = "12";
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    return hour + ":" + minute + amPM;
  }


}
