// Core Imports
import {
	Component,
	OnInit,
	TemplateRef,
	ViewChild
} from '@angular/core';

import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';

import { 
	Binary 
} from "@angular/compiler";

//Third-Party Imports
import {
	BsModalRef,
	BsModalService
} from 'ngx-bootstrap';

//Application Imports
import {
	Badge,
	Item,
	User,
	Conditions,
	Section,
	Course
} from 'shared/models';

import {
	BadgeService,
	ItemService,
	UserService,
	SectionService
} from 'shared/services';

const ITEMS: any[] = [
	{
		_id: "12",
		item_type: "Head",
		item_name: "Dark Sword",
		item_photo: "dark-sword.jpg",
		item_description: "Pierces to the soul.",
		item_hp: "123",
		item_xp: "124",
		item_ailment: "Poison"
	}
];

const BADGES = [
	{
		_id: "1",
		badge_name: "Badge1",
		badge_photo: "badge1.png",
		badge_description: "Earn th issd fs dfsdf sdsd fs df dsflo  lsdf fsdfsd fsdf ffff ffff ffff fff fffffffff ffffff fffff ffff",
		badge_conditions: new Conditions(),
		is_system: false,
		badge_attainers: []
	},
	// {
	// 	_id: "2",
	// 	badge_name: "Badge2",
	// 	badge_photo: "badge2.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// },
	// {
	// 	_id: "1",
	// 	badge_photo: "badge1.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// },
	// {
	// 	_id: "2",
	// 	badge_photo: "badge2.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// },
	// {
	// 	_id: "1",
	// 	badge_photo: "badge1.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// },
	// {
	// 	_id: "2",
	// 	badge_photo: "badge2.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// },
	// {
	// 	_id: "1",
	// 	badge_photo: "badge1.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// },
	// {
	// 	_id: "2",
	// 	badge_photo: "badge2.png",
	// 	badge_description: "Earn this lol",
	// 	badge_conditions: new Conditions(),
	// 	is_system: false,
	// 	badge_attainers: []
	// }
]

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.css']
})

export class InventoryComponent implements OnInit {
	@ViewChild('imageInput') imageInput;
	//modal
	private bsModalRef: BsModalRef;
	private itemForm: FormGroup;
	private badgeForm: FormGroup;
	//url of uploaded image
	private itemImgUrl: string = "/assets/images/not-found.jpg";
	private badgeImgUrl: string = "/assets/images/not-found.jpg";
	private badgeImgFile: File;

	currentUser: User;
	items: Item[];
	badges: Badge[];
	instructorSections: any[];
	badgeImage: Binary;
	// formData: any;

	constructor(
		private formBuilder: FormBuilder,
		private itemService: ItemService,
		private modalService: BsModalService,
		private userService: UserService,
		private sectionService: SectionService,
		private badgeService: BadgeService
	) { }

	ngOnInit() {
		this.getUser();
		this.initializeForm();
		this.getSections();
	}

	createBadge() {
		// console.log("description:" + this.badgeForm.value.badgeName);
		console.log('Trying to create badge.. yay!');
		console.log('badge name: ' + this.badgeForm.value.badgeName);
		console.log('badge image: ' + this.badgeForm.value.badgeImage);
		console.log('badge description: ' + this.badgeForm.value.badgeDescription);
		console.log('badge section: ' + this.badgeForm.value.badgeSection);
		console.log('badge XP: ' + this.badgeForm.value.badgeXP);
		console.log('badge loginstreak: ' + this.badgeForm.value.badgeLoginStreak);
		// console.log('\nbadge file: ');
		// console.log(this.badgeImgFile);
		console.log(this.imageInput);
		let imageFile = this.imageInput.nativeElement;
		console.log('uhmm. hi?');
		if(imageFile.files && imageFile.files[0]) {
			const formData = new FormData();
			formData.append('image', imageFile.files[0]);
			console.log(formData);
			this.badgeService.uploadBadge(formData).subscribe(res => {
				console.log('hooooooooooraaaaaaaaaaaahhhhhh');
			});
		}

		// this.badgeService.uploadBadge(this.badgeImgFile).subscribe(res => {
		// this.badgeService.uploadBadge(this.formData).subscribe(res => {
			
		// 	if(res) {
		// 		console.log('image uploaded');
		// 	} else {
		// 		console.log('failed to upload');
		// 	}
		// });

		// this.badgeService.createBadge(this.setBadge()).subscribe(data => {
		// 	if(data) {
		// 		console.log('Yay badge created');
		// 	} else {
		// 		console.log('no badge created');
		// 	}
		// });

		this.bsModalRef.hide();
		this.badgeForm.reset();
	}

	private setConditions() {
		let badgeCondition = new Conditions();
		badgeCondition.setXp(this.badgeForm.value.badgeXP);
		badgeCondition.setLogInstreak(this.badgeForm.value.badgeLoginStreak);
		return badgeCondition;
	}

	private setBadge() {
		let badge = new Badge();
		badge.setBadge(
			this.badgeForm.value.badgeName,
			this.badgeForm.value.badgeImage,
			this.badgeForm.value.badgeDescription,
			this.setConditions(),
			false,
			false
		);
		return badge;
	}


	public badgeImageEvent(event: any) {		
		if (event.target.files && event.target.files[0]) {
			const fileSelected: File = event.target.files[0];
			var reader = new FileReader();
			// this.badgeImgFile = fileSelected;
			// this.formData = new FormData();
			// this.formData.append("image", fileSelected);
			// console.log('form data =============');
			// console.log(this.formData);
			// console.log('--------------target------------');
			// console.log(event.target);

			// this.badgeService.createBadge(fileSelected, fileSelected.name).subscribe(data => {
			// 	if(data) {
			// 		console.log('succeessful');
			// 	} else {
			// 		console.log('eww you\'re not.')
			// 	}
			// });
			reader.readAsDataURL(event.target.files[0]); // read file as data url

			reader.onload = (event) => { // called once readAsDataURL is completed
				let target: any = event.target;
				let content: string = target.result;
				this.badgeImgUrl = content;
			}
		}
	}

	createItem() {
		console.log("description:" + this.itemForm.value.itemName);

	}

	initializeForm() {
		this.itemForm = this.formBuilder.group({
			itemName: new FormControl("", Validators.required),
			itemImage: new FormControl(""),
			itemEffect1: new FormControl("", Validators.required),
			itemEffect2: new FormControl("", Validators.required),
			itemEffect3: new FormControl("", Validators.required),
			itemDescription: new FormControl("", Validators.required)
		});
		this.badgeForm = this.formBuilder.group({
			badgeName: new FormControl("", Validators.required),
			badgeImage: new FormControl(""),
			badgeDescription: new FormControl("", Validators.required),
			badgeSection: new FormControl("", Validators.required),
			badgeXP: new FormControl("", Validators.required),
			badgeLoginStreak: new FormControl("", Validators.required)
		});
	}

	public itemImageEvent($event: any) {
		if ($event.target.files && $event.target.files[0]) {
			const fileSelected: File = $event.target.files[0];
			var reader = new FileReader();

			reader.readAsDataURL($event.target.files[0]); // read file as data url

			reader.onload = ($event) => { // called once readAsDataURL is completed
				let target: any = $event.target;
				let content: string = target.result;
				this.itemImgUrl = content;
			}
		}
	}

	/**
	 * Obtains information of the current user
	 */
	getUser(): void {
		let currentUser = JSON.parse(localStorage.getItem("currentUser"));
		this.userService.getUser(currentUser._id)
			.subscribe(user => {
				this.currentUser = new User(user);
				this.getTeacherItems();
				this.getTeacherBadges();
			});
	}

	getTeacherItems() {
		//AHJ: unimplemented; add items relative to the teacher; 
		//remove dummy below if itemService.getTeacherInventoryItems() get properly implemented
		this.items = ITEMS.map(item => new Item(item));

		/*this.itemService.getTeacherInventoryItems().subscribe(items => {
			this.items = items.map(item => new Item(item));
		});*/
	}

	getTeacherBadges() {
		//AHJ: unimplemented; add items relative to the teacher; 
		//remove dummy below if itemService.getTeacherInventoryItems() get properly implemented
		this.badges = BADGES.map(badge => new Badge(badge));

		/*this.itemService.getTeacherInventoryItems().subscribe(items => {
			this.items = items.map(item => new Item(item));
		});*/
	}

	/**
	 * Open item modal
	 * @description Open 'Add Item' modal.
	 * @param itemTemplate template
	 */
	openItemModal(itemTemplate: TemplateRef<any>) {
		console.log("here!");
		this.bsModalRef = this.modalService.show(itemTemplate);
	}

	/**
	 * Open item modal
	 * @description Open 'Add Item' modal.
	 * @param itemTemplate template
	 */
	openBadgeModal(badgeTemplate: TemplateRef<any>) {
		console.log("here!");
		this.bsModalRef = this.modalService.show(badgeTemplate);
	}

	samplevar: boolean = false;
	sampleTemplate(sampleTemplate: TemplateRef<any>) {
		console.log('sample templaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaate');
		if(this.samplevar) {
			console.log('you are iiiiiiiiiin');
		} else {
			console.log('ooooooooooooouuuuuuuuuuuuuuuuut');
		}
	}

	getSections(): void {
		this.sectionService.getInstructorSections(
			this.userService.getCurrentUser().getUserId()
		).subscribe(data => {
			console.log('here is the data ' + data[0].section.course_id);
			this.instructorSections = data;
		});
	}
}
