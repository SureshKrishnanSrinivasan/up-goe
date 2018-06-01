//Core Imports
import {
	Component,
	OnInit,
	ViewChild,
	TemplateRef,
	Input
} from '@angular/core';

import {
	ActivatedRoute
} from '@angular/router';

//Third-Party Imports
import {
	BsModalRef,
	BsModalService,
	ModalDirective
} from 'ngx-bootstrap';

//Application Imports
import {
	Quest,
	Section,
	SectionQuest,
	User
} from 'shared/models';

import {
	Chart
} from 'chart.js';

import {
	PageService,
	SectionService,
	UserService,
	QuestService,
	FileService
} from 'shared/services';
import { HttpClient } from '@angular/common/http';
import { QuestMap } from 'shared/models/quest-map';

const SECTION: any = {
	_id: "2",
	course_id: "sad3",
	section_name: "A",
	students: [
		{
			user_id: "1",
			status: "E"
		},
		{
			user_id: "2",
			status: "R"
		}
	],
	instructor: "Miguel Guillermo",
	quests: [
		new SectionQuest({ quest_id: "5a3b8e82b19a9e18d42d3890", quest_participants: ["5a37f4500d1126321c11e5e7", "2"], quest_prerequisite: [] }),
		new SectionQuest({ quest_id: "1", quest_participants: ["1", "2"], quest_prerequisite: [] })
	],
	items: [],
	badges: []
};


const MOCKQUESTMAP: String[] = [
	"5a3b8e82b19a9e18d42d3890,scatter,5,25",
	"5a3b8e82b19a9e18d42d3890,scatter,10,25",
	"1,scatter,15,25,67890",
	"7678,scatter,15,30,56743",
	",line,5,25,10,25",
	",line,10,25,15,25",
	",line,15,25,15,30",
	",exclude,15,25,N",
];

@Component({
	selector: 'app-specific-quest-map',
	templateUrl: './specific-quest-map.component.html',
	styleUrls: ['./specific-quest-map.component.css']
})
export class SpecificQuestMapComponent implements OnInit {
	@ViewChild('questTemplate') questTemplate: TemplateRef<any>;

	
	private quests: Quest[] = new Array();
	
	// quest map chart
	xTick: number;
	yTick: number;
	chart: Chart;
	chartColors: Array<any>;
	chartLabels: Array<any> = [];
	chartWidth: number;
	chartHeight: number;

	// quest map details
	questMap: QuestMap;

	currentUser: User;
	//AHJ: unimplemented; remove this when quest is retrieved properly
	private QUEST: any = {
		_id: "1",
		quest_title: "Missing Ring!",
		quest_description: "Retrieve the missing ring.",
		quest_retakable: false,
		quest_badge: "324",
		quest_item: ["1324", "2323", "324234"],
		quest_xp: 134,
		quest_hp: 3432,
		quest_start_time_date: new Date('01/01/2017'),
		quest_end_time_date: new Date('10/10/2019'),
		quest_party: false,
		quest_prerequisite: []
	}


	private bsModalRef: BsModalRef;
	private currentSection: Section;
	private questClicked: Quest;

	constructor(
		private http: HttpClient,
		private modalService: BsModalService,
		private pageService: PageService,
		private route: ActivatedRoute,
		private sectionService: SectionService,
		private userService: UserService,
		private questService: QuestService,
		private fileService: FileService

	) {
		this.currentUser = this.userService.getCurrentUser();
	}

	ngOnInit() {
		this.setDefault();
		this.getCurrentUser();
		this.getCurrentSection();
		this.loadQuestMap();
	}

	loadQuestMap() {
		this.questService.getUserJoinedQuests(this.currentUser.getUserId())
			.subscribe(quests => {
				console.log(quests);
				//AHJ: unimplented; removed comment form below if quests can be retrieved;
				//this.quests = quests.map(quest => new Quest(quest));
				this.quests = [];
				this.quests.push(new Quest(this.QUEST));
				//AHJ: unimplemented; getter for quest map data (remove comment marker belowif available)
				//this.questService.getQuestMap(this.currentSection.getCourseId()).subscribe(data => {
				this.questMap = new QuestMap(MOCKQUESTMAP, this.quests, true);
				this.setQuestMap();
				//});
			});
	}

	openQuest(quest: any) { //'quest: any' in here means the quest has not been converted to Quest type
		//AHJ: Unimplemented
		//WARNING!! Remove QUESTS in specific-qm.html when this is implemented
		console.log(quest);
		this.questClicked = new Quest(quest);
		if (this.questClicked) {
			this.bsModalRef = this.modalService.show(this.questTemplate);
		}
	}

	/**
	 * Sets all the default less-related functions/properties of the component
	 */
	setDefault() {
		this.pageService.isProfilePage(false);
	}

	/**
	 * Obtains the user's navigated section
	 * @description Obtains the current section and stores it into 'currentSection' variable
	 */
	getCurrentSection() {
		this.route.paramMap.subscribe(params => {
			let sectionId = params.get('sectionId');
			//AHJ: unimplemented; dummy section remove when working
			this.currentSection = new Section(SECTION);
			console.log(this.currentSection);
		});
	}

	getCurrentUser() {
		//AHJ: unimplemented... or not sure. Di ko sure kung tama na ning pagkuha sa current user
		this.currentUser = new User(this.userService.getCurrentUser());
		console.log("currUser");
		console.log(this.currentUser);
	}

	acceptQuest() {
		//AHJ: unimplemented
		this.bsModalRef.hide();
	}

	submitQuest() {
		//AHJ: unimplemented
		this.bsModalRef.hide();
	}

	abandonQuest() {
		//AHJ: unimplemented
		this.bsModalRef.hide();
	}

	isParticipating(quest_id: string): boolean {
		let isParticipant = this.currentSection.isQuestParticipant(this.currentUser.getUserId(), quest_id);
		return isParticipant;
	}

	pointClicked(event: Event) {
		console.log("clicked!");
		let activePoint = this.chart.getElementAtEvent(event);
		var selectedPoint = activePoint[0];
		selectedPoint.custom = selectedPoint.custom || {};
		selectedPoint.custom.backgroundColor = 'rgba(128,128,128,1)';
		selectedPoint.custom.radius = 7;
	}

	/**
    * Sets the quest map based on the data received.
	* @param data string where the quests and its respective coordinates will be located
    */
	setQuestMap() {
		this.chartColors = this.pageService.lineChartColors;
		this.chartWidth = 650;
		this.chartHeight = 300;

		var QM = {
			datasets: this.questMap.getQuestMapDataSet()
		}

		this.xTick = 50;
		this.yTick = 50;

		let options = {
			onClick: this.chartClicked.bind(this),
			legend: { display: false },
			scales: {
				xAxes: [{
					display: false,
					type: 'linear',
					ticks: {
						max: this.xTick,
						min: 0
					}
				}],
				yAxes: [{
					display: false,
					ticks: {
						max: this.yTick,
						min: 0
					}
				}],
			}
		}

		var HTMLchart = document.getElementById("quest-map");
		var ctx = (<HTMLCanvasElement>HTMLchart).getContext("2d");

		this.chart = new Chart(ctx, {
			data: QM,
			options: options
		});

		//this.onChartClick(HTMLchart, chart, this.chartWidth, this.chartHeight, xTick, yTick);

	}

	/**
	 * https://stackoverflow.com/questions/38112802/how-to-save-a-text-to-file-and-read-it-again-but-save-as-binary-in-javascript
	 * https://codepen.io/sandeep821/pen/JKaYZq
	 * https://stackoverflow.com/questions/41547945/write-to-a-local-file-using-angular2-typescript-locally
	 * https://stackoverflow.com/questions/33643107/read-and-write-a-text-file-in-typescript
	 * https://www.google.com.ph/search?safe=active&biw=1366&bih=637&ei=zi_1Wv6jLcOa8wWgk4CIAg&q=save+text+to+file+typescript&oq=save+text+to+file+typescript&gs_l=psy-ab.3..33i22i29i30k1.241604.250182.0.250343.36.29.1.3.3.0.251.3658.0j13j7.20.0....0...1c.1.64.psy-ab..13.23.3600...0j0i67k1j0i131i67k1j0i131k1j0i10k1j0i22i30k1.0.SX3c2O49JSI
	 */

	/**
	 * Triggers when the quest map chart is clicked.
	 * Does nothing when no point has been clicked,
	 * Opens quest modal when quest point is clicked and;
	 * Opens add quest if plus point is clicked.
	 * 
	 * @param $event the event of the point clicked on the chart
	 */
	chartClicked($event) {
		var points: any = this.chart.getDatasetAtEvent($event);
		var points: any = this.chart.getDatasetAtEvent($event);
		if (points.length != 0) {
			let x = points[0]._model.x / (this.chartWidth / this.xTick);
			let y = (this.chartHeight - points[0]._model.y) / (this.chartHeight / this.yTick);
			if (x % 5 != 0 || y % 5 !== 0) {
				this.addNewQuestLine(x, y);
			} else {
				var questId = this.questMap.getQuestIdOf(x, y);
				var quests: Quest[] = this.quests.filter(quest => quest.getQuestId() == questId);
				if(quests.length > 0){
					this.openQuest(quests[0]);
				}
			}
			console.log(x);
			console.log(y);
		}
		console.log(this.chart.getDatasetAtEvent($event));
		console.log(this.chart.getElementAtEvent($event));
	}

	addNewQuestLine(x, y) {
		let basisX = Math.round(x / 10) * 10;
		let basisY = Math.round(y / 10) * 10;
		if (x % 5 != 0) {
			if (basisX - x > 0) {
				this.questMap.addNewQuestLine(x, y, "E");
			}
		}
	}

	openQuestPoint() {

	}

	addData(chart, label, data) {
		chart.data.labels.push(label);
		chart.data.datasets.forEach((dataset) => {
			dataset.data.push(data);
		});
		chart.update();
	}
}