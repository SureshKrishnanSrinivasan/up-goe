//Core Imports
import {
  Component,
  OnInit,
  Input,
  HostListener,
  ElementRef
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  NgModel
} from '@angular/forms';

import {
  Router
} from '@angular/router';

//Application Imports
import {
  CommentPost,
  Course,
  Quest,
  Section,
  User
} from 'shared/models';

import {
  CommentPostService,
  PageService,
  QuestService,
  SectionService,
  UserService
} from 'shared/services';

@Component({
  selector: 'gen-sidetab',
  templateUrl: './gen-sidetab.component.html',
  host: {
    '(document:click)': 'handleClick($event)',
  },
  styleUrls: ['./gen-sidetab.component.css']
})
export class GenSidetabComponent implements OnInit {
  elementRef: ElementRef;
  @Input('isProfile') isProfile: boolean = false;

  //current user
  user: User;
  image: string;


  //for pages other than profile page  
  editForm: FormGroup;
  quests: Quest[] = []; //user's quests
  //for progress bar; 
  defaultPBClass: string = 'progress-bar progress-bar-striped active';
  progressBarClass: string[];
  questTimePercentage: string[];
  questTimeDisplay: string[];

  //for profile page only
  isEditing: boolean = false;
  sections: any[] = [];

  //for collapsible navigation bar
  isShowMenuButton: boolean = false;
  windowWidth: number = window.innerWidth;
  showSideTab: boolean;

  //if screen size changes it'll update
  @HostListener('window:resize', ['$event'])
  resize(event) {
    this.checkSize();
  }

  constructor(
    private commentPostService: CommentPostService,
    private myElement: ElementRef,
    private formBuilder: FormBuilder,
    private pageService: PageService,
    private questService: QuestService,
    private sectionService: SectionService,
    private userService: UserService,
    private router: Router
  ) {
    this.checkSize();
    this.editForm = formBuilder.group({
      schoolId: null,
      email: null,
      contactNo: null
    });
    this.editForm.disable();
    this.elementRef = myElement;
  }

  ngOnInit() {
    this.setDefault();
    this.getUser();
    if (this.isProfile) {
      this.getUserSections(this.user.getUserId());
    } else {
      this.getQuests(this.user.getUserId());
    }
  }

  setDefault() {
    this.isEditing = false;
    this.image = "/assets/images/not-found.jpg"
    this.defaultPBClass = 'progress-bar progress-bar-striped active';
    this.pageService.isProfile.subscribe(isProfile => {
      this.isProfile = isProfile;
    });
  }

  /**
   * Obtains information of the current user
   * @description Obtains current user's information as well as knowing what information to display
   * in the sidetab; personal information are displayed on general-profile page while 
   * section quests are for other pages except general-profile page
   */
  getUser(): void {
    // ced: I think this should be in the User model, by the get method. Current user will be used temporarily
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.user = new User(this.userService.getCurrentUser());

    let image: string = this.user.getUserPhoto() ? this.user.getUserPhoto() : "avatar.jpg";
    this.image = "/assets/images/" + image;

    /*this.userService.getUser(currentUser._id)
      .subscribe(user => {
        this.user = new User(user);

        let image: string = this.user.getUserPhoto()? this.user.getUserPhoto(): "avatar.jpg";
        this.image = "/assets/images/" + image;

        if (this.isProfile) {
          this.getUserSections(this.user.getUserId());
        } else {
          this.getQuests(this.user.getUserId());
        }
      });*/
  }

  /**
   * Get the array of sections where the user is a student
   * @description Gets the user's array of sections and the course where it belongs and 
   * stores it in the 'sections' and 'courses' array respectively; 
   * used when the user is in the general-profile page
   * @param user_id id of the user whose array of sections are to be retrieved
   * 
   */
  getUserSections(user_id: string) {
    //AHJ: unimplemented (must be section with attached course_name)
    console.log(user_id);
    this.sectionService.getUserSections(user_id).subscribe(courseSections => {
      //AHJ: Remove everything below this line until marker encountered
      let section = new Section();
      section.setSection("1", "A", [], "Miguel Guillermo", [], [], []);
      const sections = [
        {
          course_name: "CMSC 128",
          section: section
        },
        {
          course_name: "CMSC 141",
          section: section
        }
      ]
      //AHJ: Remove until here 


      //change 'sections' variable to courseSections if getUserSections() functions correctly
      this.sections = sections;
    });
  }

  /**
   * Obtains quests participated by the user
   * @description Obtains quests of the current user and stores it to 'courses' variable;
   * used when user is navigating on pages other than the general-profile page
   * 
   * @param user_id the id of the user that asks for the list of quests
   */
  getQuests(user_id): void {
    this.questService.getUserQuests(user_id)
      .subscribe(object => {
        //AHJ: need more fixes
        //this.quests = quests;
        //this.timeDisplays();
      });
  }

  /**
   * Edits the user's information
   * @description Edits the user's information; changes isEditing variable which changes the
   * features of the input fields
   */
  endEditing() {
    this.isEditing = !this.isEditing;
    this.editForm.disable();
  }

  startEditing() {
    this.isEditing = !this.isEditing;
    this.editForm.enable();
  }

  /*Below are the helper functions for this component */

  checkSize() {
    this.windowWidth = window.innerWidth;
    if (this.windowWidth <= 765) {
      this.isShowMenuButton = true;
    } else {
      this.isShowMenuButton = false;
    }
  }

  /**
   * Navigates to the specific section's page
   * @param section_id id of the section where the user must be redirected to
   */
  openSectionPage(section_id: string) {
    //AHJ: must navigate to the specific section's home page yet it is still not available
    console.warn(section_id);
    this.router.navigate(['/specific/specific-news', section_id]);
  }

  /**
   * Returns the difference in minutes of two dates
   * @param date1 the date of the further date
   * @param date2 the date of the earlier date
   * 
   * @returns the difference (in minutes) of the two dates
   */
  timeDiff(date1: Date, date2: Date): number {
    date1 = new Date(date1);
    date2 = new Date(date2);

    let time1 = date1.getTime();
    let time2 = date2.getTime();
    let diffInMs: number = time1 - time2;

    return diffInMs;
  }

  /**
   * Changes the time displays in the progress bar and sets the width of the progress bar
   */
  timeDisplays() {
    let string: string = "";

    this.questTimeDisplay = [];
    this.questTimePercentage = [];
    setInterval(() => {
      for (let i = 0; i < this.quests.length; i++) {
        let timePerc: number = 100 - this.timeDiff(this.quests[i].getQuestEndTimeDate(), new Date()) / this.timeDiff(this.quests[i].getQuestEndTimeDate(), this.quests[i].getQuestStartTimeDate()) * 100;
        let totalMinRem: number = this.timeDiff(this.quests[i].getQuestEndTimeDate(), new Date());
        let hourRem: number = Math.floor(totalMinRem / 1000 / 60 / 60);

        this.toggleClass(hourRem, i);
        string = this.getTimeLabel(totalMinRem, hourRem);
        if (totalMinRem <= 0) {
          timePerc = 100;
        }

        this.questTimeDisplay[i] = string;
        this.questTimePercentage[i] = timePerc.toString() + '%';
      }
    }, 1000);
  }

  /**
   * Returns the appropriate progress bar label
   * @description Returns the appropriate progress bar label based on either the total minutes 
   * remaining or the hours remaining
   * @param totalMinRem the total minutes remaining for the quest
   * @param hourRem the hours remaining for the quest
   * 
   * @returns string label for the progress bar
   */
  getTimeLabel(totalMinRem: number, hourRem: number): string {
    let string = "";
    if (totalMinRem <= 0) {
      string = "Time's up!";
    } else if (hourRem >= 168) {
      let weekRem: number = Math.floor(totalMinRem / 1000 / 60 / 60 / 128);
      let dayRem = Math.floor(totalMinRem / 1000 / 60 / 60 % 128);
      string = weekRem.toString() + " wk(s) & " + dayRem.toString() + " dy(s) left";
    } else if (hourRem >= 24) {
      let dayRem: number = Math.floor(totalMinRem / 1000 / 60 / 60 / 24);
      hourRem = Math.floor(totalMinRem / 1000 / 60 / 60 % 24);
      string = dayRem.toString() + " dy(s) & " + hourRem.toString() + " hr(s) left";
    } else {
      let minRem: number = Math.floor(totalMinRem / 1000 / 60 % 60);
      string = hourRem.toString() + " hr(s) & " + minRem.toString() + " mn(s) left";
    }
    return string;
  }

  /** 
   * @summary changes the color of the progress bar by changing its class
   * 
   * @param hourRem hours remaining for quest of index i
   * @param i index of the quest to be checked
   */
  toggleClass(hourRem, i) {
    //AHJ: not working; fix this later
    this.progressBarClass = [];
    if (hourRem <= 24) {
      this.progressBarClass[i] = 'progress-bar-danger';
    } else {
      this.progressBarClass[i] = 'progress-bar-success';
    }
  }

  handleClick(event) {
    var clickedComponent = event.target;
    var inside = false;
    do {
      if (clickedComponent === this.elementRef.nativeElement) {
        inside = true;
      }
      clickedComponent = clickedComponent.parentNode;
    } while (clickedComponent);
    if (!inside && this.windowWidth <= 765) {
      this.showSideTab = false;
    }
  }
}
