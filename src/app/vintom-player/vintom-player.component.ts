import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VintomService, VintomVideoData } from '../services/vintom.service';

declare global {
  interface Window {
    vintom: {
      Player: any;
    };
  }
}

@Component({
  selector: 'app-vintom-player',
  templateUrl: './vintom-player.component.html',
  styleUrls: ['./vintom-player.component.scss']
})
export class VintomPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('playerContainer', { static: true }) playerContainer!: ElementRef;

  playerForm: FormGroup;
  videoPlayer: any;
  response: any = null;
  loading: boolean = false;

  languages = [
    { value: 'ENG', label: 'English' },
    { value: 'ES', label: 'Español' },
    { value: 'PL', label: 'Polish' }
  ];

  images = [
    { value: 'flower', label: 'Flower' },
    { value: 'fish', label: 'Fish' },
    { value: 'car', label: 'Car' },
    { value: 'house', label: 'House' },
    { value: 'family', label: 'Family' }
  ];

  colors = [
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'green', label: 'Green' },
    { value: 'purple', label: 'Purple' },
    { value: 'red', label: 'Red' }
  ];

  charts = [
    { value: 'pie-chart', label: 'Pie Chart' },
    { value: 'bar chart', label: 'Bar Chart' }
  ];

  validNames = [
    "Aaron", "Abigail", "Adam", "Addison", "Aidan", "Aiden", "Alan", "Alexander",
    "Amelia", "Andrew", "Angel", "Anthony", "Aria", "Asher", "Aubrey", "Audrey",
    "Aurora", "Austin", "Ava", "Avery", "Bella", "Benjamin", "Bradley", "Brandon",
    "Brayden", "Brian", "Bruce", "Caleb", "Cameron", "Camila", "Carl", "Carter",
    "Chad", "Charles", "Charlotte", "Christopher", "Cody", "Connor", "Corey", "Cory",
    "Craig", "Dakota", "Dale", "Daniel", "Danny", "Daren", "David", "Denis", "Dennis",
    "Derek", "Donald", "Douglas", "Dylan", "Edward", "Eleanor", "Eli", "Elias", "Elijah",
    "Elizabeth", "Ella", "Ellie", "Emilia", "Emily", "Emma", "Eric", "Ethan", "Evan",
    "Evelyn", "Everly", "Ezekiel", "Ezra", "Frank", "Gabriel", "Gary", "Gavin", "Gerald",
    "Glenn", "Grace", "Grayson", "Gregory", "Hannah", "Harper", "Hazel", "Henry", "Hudson",
    "Hunter", "Isaac", "Isabella", "Isaiah", "Jackson", "Jacob", "James", "Jared", "Jason",
    "Jaxon", "Jayden", "Jeffery", "Jeffrey", "Jeremiah", "Jeremy", "Jerry", "Jesse", "Joe",
    "John", "Jonathan", "Jordan", "Jose", "Joseph", "Joshua", "Josiah", "Juan", "Julian",
    "Justin", "Keith", "Kenneth", "Kevin", "Kyle", "Landon", "Larry", "Layla", "Leah",
    "Leo", "Levi", "Liam", "Lillian", "Lily", "Lincoln", "Logan", "Lucas", "Lucy", "Luis",
    "Luke", "Luna", "Madison", "Marcus", "Mark", "Mason", "Mateo", "Matthew", "Maverick",
    "Mia", "Michael", "Mike", "Mila", "Miles", "Natalie", "Nathan", "Nicholas", "Noah",
    "Nolan", "Nora", "Oliver", "Olivia", "Owen", "Patric", "Paul", "Penelope", "Peter",
    "Randall", "Randy", "Raymond", "Richard", "Ricky", "Riley", "Robert", "Rodney", "Roger",
    "Ronald", "Russell", "Ryan", "Samuel", "Scarlett", "Scott", "Sean", "Sebastian", "Shane",
    "Shawn", "Sofia", "Sophia", "Stella", "Steven", "Terry", "Thomas", "Tim", "Timothy",
    "Todd", "Tony", "Travis", "Troy", "Tyler", "Victoria", "Vincent", "Violet", "Wayne",
    "William", "Willow", "Wyatt", "Zachary", "Zoey"
  ].sort();

  constructor(
    private formBuilder: FormBuilder,
    private vintomService: VintomService
  ) {
    this.playerForm = this.formBuilder.group({
      name: ['Peter', [Validators.required]],
      data_source: [{ value: 'API', disabled: false }, Validators.required],
      language: ['ENG', Validators.required],
      image: ['fish', Validators.required],
      colour: ['blue', Validators.required],
      percent: ['45', [Validators.required, Validators.min(0), Validators.max(100)]],
      chart: ['pie-chart', Validators.required],
      cta_url: ['https://www.vintom.com', Validators.pattern('https?://.+')]
    });

    this.setupErrorHandler();
  }

  ngOnInit(): void {
    this.checkScriptsLoaded();

    if (this.playerContainer && this.playerContainer.nativeElement) {
      console.log('Player container element ID:', this.playerContainer.nativeElement.id);
    }

    const dataSourceControl = this.playerForm.get('data_source');
    if (dataSourceControl) {
      dataSourceControl.valueChanges.subscribe(() => {
        if (dataSourceControl.value !== 'API') {
          dataSourceControl.setValue('API', { emitEvent: false });
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.videoPlayer) {
      try {
        this.videoPlayer.remove();
      } catch (error) {
        console.error('Error cleaning up player', error);
      }
    }
  }

  setupErrorHandler(): void {
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason &&
        (event.reason.name === 'AbortError' ||
          (event.reason.message && event.reason.message.includes('play() request was interrupted')))) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  checkScriptsLoaded(): void {
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' &&
        window.vintom &&
        (window as any).preparePlayerData) {
        clearInterval(interval);
      }
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      if (!(window.vintom && (window as any).preparePlayerData)) {
        console.error('Failed to load Vintom scripts within timeout');
      }
    }, 10000);
  }

  initializePlayer(): void {
    if (!window.vintom) {
      console.error('Vintom player not loaded. Please try again later.');
      return;
    }
    if (this.videoPlayer) {
      try {
        this.videoPlayer.remove();
      } catch (error) {
        console.error('Error removing existing player', error);
      }
      this.videoPlayer = null;
    }

    const containerId = this.playerContainer.nativeElement.id;
    if (!containerId) {
      console.error('Player container ID not found');
      return;
    }

    const formData: VintomVideoData = {
      projectCode: 'VINTOMFEATURESDEMO1',
      ...this.playerForm.value
    };
    const playerData = this.vintomService.preparePlayerData(formData, false);

    try {
      this.videoPlayer = new window.vintom.Player()
        .initialize(containerId)
        .personalize(playerData)
        .run();
    } catch (error) {
      console.error('Error initializing Vintom player', error);
    }
  }
}
