//Core Imports
import {
	Component,
	OnInit,
	Input,
	HostListener,
	ElementRef,
	TemplateRef
} from '@angular/core';

import {
	FormBuilder,
	FormGroup,
	NgModel,
	Validators,
	FormControl
} from '@angular/forms';

import {
	Router
} from '@angular/router';

//Third-Party Imports
import {
	BsModalService,
	BsModalRef
} from 'ngx-bootstrap';

//Application Imports
import {
	CommentPost,
	Course,
	Quest,
	Section,
	User,
	imageDir
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
	styleUrls: ['./gen-sidetab.component.css'],
	host: {
		'(document:click)': 'handleClick($event)',
	}
})
export class GenSidetabComponent implements OnInit {
	@Input('isProfile') isProfile: boolean = false;

	//current user
	currentUser: User;
	image: string = "";

	//for pages other than profile page  
	editForm: FormGroup;
	quests: Quest[] = []; //user's quests
	questCourses: string[] = [];
	questClicked: Quest;
	//for progress bar; 
	defaultPBClass: string = 'progress-bar progress-bar-striped';
	progressBarClass: string[] = [];
	questTimePercentage: string[] = [];
	questTimeDisplay: string[] = [];
	//for quest modal
	bsModalRef: BsModalRef;

	//for profile page only
	isEditing: boolean = false;
	sections: any[] = [];

	//for collapsible sidetab
	isShowSideTab: boolean = false;
	windowWidth: number = window.innerWidth;

	//if screen size changes it'll update
	@HostListener('window:resize', ['$event'])
	resize(event) {
		this.checkSize();
	}

	constructor(
		private commentPostService: CommentPostService,
		private elementRef: ElementRef,
		private formBuilder: FormBuilder,
		private modalService: BsModalService,
		private pageService: PageService,
		private questService: QuestService,
		private sectionService: SectionService,
		private userService: UserService,
		private router: Router
	) {
		this.image = imageDir + "not-found.jpg";
		this.setUser();
		this.initializeForm();
	}

	ngOnInit() {
		this.checkSize();
		this.setDefault();
		if (this.isProfile) {
			this.getUserSections(this.currentUser.getUserId());
		} else {
			this.getQuests(this.currentUser.getUserId());
		}
	}

	submit() {
		if(this.editForm.get('contactNo').dirty) {
			let currentUserId = this.userService.getCurrentUser().getUserId();
			let userContactNo = this.editForm.value.contactNo;

			this.userService.changeProfileData(currentUserId, userContactNo)
			.subscribe(isAdded => { // No returned value yet...
				if(isAdded) {
					console.log('Profile succesfully edited.');
					this.initializeForm();
				} else {
					console.log('Profile failed to be edited.');
				}
			});
			console.log('Profile succesfully edited.');
			this.currentUser.setUserContactno(userContactNo);
		}
	}

	get userContactNo() {
		return this.editForm.get('contactNo') as FormControl;
	}

	initializeForm() {
		this.editForm = this.formBuilder.group({
			schoolId: new FormControl({value: this.currentUser.getUserSchoolId(), disabled: true}),
			email: new FormControl({value: this.currentUser.getUserEmail(), disabled: true}),
			contactNo: new FormControl(this.currentUser.getUserContactNo(), Validators.required),
		});
		this.editForm.disable();
	}

	setDefault() {
		this.isEditing = false;
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
	setUser(): void {
		this.currentUser = this.userService.getCurrentUser();
		this.image = this.currentUser.getUserPhoto();
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
		this.sectionService.getUserSections(this.currentUser.getUserId()).subscribe(courseSections => {
			this.sections = courseSections;
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
		//AHJ: unimplemented; get quest by section; not sure... this may be okay as is 
		this.questService.getUserJoinedQuests(user_id)
			.subscribe(quests => {
				console.warn(quests);
				quests.forEach(quest => {
					console.log(quest.questData);
					this.quests.push(new Quest(quest.questData));
					this.questCourses.push(quest.course + '-' + quest.section);
				});
				console.warn(this.quests);
				this.timeDisplays();
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
		this.editForm.get("schoolId").disable();
		this.editForm.get("email").disable();
	}

	openQuest(template: TemplateRef<any>, quest: any) { //'quest: any' in here means the quest has not been converted to Quest type
		//AHJ: Unimplemented
		//WARNING!! Remove QUESTS in specific-qm.html when this is implemented
		console.log(quest);
		this.questClicked = quest;
		console.warn(this.questClicked);
		if (this.questClicked) {
			this.bsModalRef = this.modalService.show(template);
		}
	}

	submitQuest(questId: String) {
		//AHJ: unimplemented
		console.log("'" + this.questClicked.getQuestTitle() + "' submitted!");
		this.bsModalRef.hide();
	}

	abandonQuest(questId: String) {
		console.log("'" + this.questClicked.getQuestTitle() + "' abandoned :(");
		//AHJ: unimplemented
		this.bsModalRef.hide();
	}

	/*Below are the helper functions for this component */

	checkSize() {
		this.windowWidth = window.innerWidth;
		if (this.windowWidth <= 768) {
			this.isShowSideTab = false;
		} else {
			this.isShowSideTab = true;
		}
	}

	/**
	 * Navigates to the specific section's page
	 * @param section_id id of the section where the user must be redirected to
	 */
	openSectionPage(section_id: string) {
		this.pageService.openSectionPage(section_id);
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
	// timeDisplays() {
	// 	let string: string = "";

	// 	this.questTimeDisplay = [];
	// 	this.questTimePercentage = [];
	// 	setInterval(() => {
	// 		for (let i = 0; i < this.quests.length; i++) {
	// 			let timePerc: number = 100 - this.timeDiff(this.quests[i].getQuestEndTimeDate(), new Date()) / this.timeDiff(this.quests[i].getQuestEndTimeDate(), this.quests[i].getQuestStartTimeDate()) * 100;
	// 			let totalMinRem: number = this.timeDiff(this.quests[i].getQuestEndTimeDate(), new Date());
	// 			let hourRem: number = Math.floor(totalMinRem / 1000 / 60 / 60);

	// 			this.toggleClass(hourRem, i);
	// 			string = this.getTimeLabel(totalMinRem, hourRem);
	// 			if (totalMinRem <= 0) {
	// 				timePerc = 100;
	// 			}

	// 			this.questTimeDisplay[i] = string;
	// 			this.questTimePercentage[i] = timePerc.toString() + '%';
	// 		}
	// 	}, 1000);
	// }
	timeDisplays() {
		let string: string = "";
		setInterval(() => {
			for (let i = 0; i < this.quests.length; i++) {
				this.progressBarClass[i] = this.quests[i].getQuestProgressBarClass();
				this.questTimeDisplay[i] = this.quests[i].getQuestTimeLabel();
				this.questTimePercentage[i] = this.quests[i].getQuestTimePercentage();
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
		if (hourRem <= 0) {
			this.progressBarClass[i] = 'bg-danger';
		} else if (hourRem <= 24) {
			this.progressBarClass[i] = 'progress-bar-animated bg-danger';
		} else {
			this.progressBarClass[i] = 'progress-bar-animated bg-success';
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
		if (!inside && this.windowWidth <= 768) {
			this.isShowSideTab = false;
		}
	}

	clickMenuButton() {
		this.isShowSideTab = !this.isShowSideTab;
	}

	formatDateTime(date) {
		return this.pageService.formatDateTime(date);
	}
}
