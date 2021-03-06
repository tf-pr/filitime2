import { Injectable } from '@angular/core';
import { Fsi } from './fsi.service';
import { Subscription } from 'rxjs';
import { LoggerService } from './logger.service';
import { DbiService } from './dbi.service';
import { Employee, Helper } from '../helper';
import { WeekViewService } from '../navigator/planboard-view/week-view/week-view.service';

@Injectable({
  providedIn: 'root'
})
export class TesterService {
  // tslint:disable:variable-name

  // private sub0: Subscription;
  // private sub1: Subscription;
  // private sub2: Subscription;
  // private sub3: Subscription;

  constructor(private dbi: DbiService,
              private logger: LoggerService,
              private wvs: WeekViewService) {
    this.noDelay();
    this.delayMeBy500();
    this.delayMeBy1000();
    this.delayMeBy2000();
    this.delayMeBy3000();
    this.delayMeBy5000();
    this.delayMeBy10000();
    this.delayMeBy60000();
  }

  private customDelay( delay: number, cb: (...args: any[]) => any ) {
    setTimeout( cb, delay );
  }

  private noDelay() {
    console.log('tester no delay');
    const nowDate = new Date();
    console.warn(nowDate.getHours() + ':' + nowDate.getMinutes() + ':' + nowDate.getSeconds() + '.' + nowDate.getMilliseconds());

    // this.syncEmployeesFor10sec();
    this.syncEmployeesForEver();
  }

  private delayMeBy500() {
    this.customDelay(500,
      () => {
        console.log('tester delay 0.5s');
        // fill me up!

        // this.logger.logErrorASAP(321, 'YEAH!');
        // this.logger.logUserInput('tester:delayMeBy500');
        // console.log(Date.now());
      });
  }

  private delayMeBy1000() {
    this.customDelay(1000,
      () => {
        console.log('tester delay 1s');
        // fill me up!

        // this.logger.logUserInput('tester:delayMeBy1000');
        // console.log(Date.now());
      });
  }

  private delayMeBy2000() {
    this.customDelay(2000,
      () => {
        console.log('tester delay 2s');


        // fill me up!

        // this.logger.logUserInput('tester:delayMeBy2000');
        // console.log(Date.now());

        // Helper.setLooperInterval(() => {
        //   console.log('addNextEmployee');
        //   this.addNextEmployee();
        // }, 10, 666);
      });
  }

  private delayMeBy3000() {
    this.customDelay(3000,
      () => {
        console.log('tester delay 3s');

        // this.createClientTest();

        // HIER handle Version check
        // this.fsi.isLatestAppVersion('0.0.0')
        //   .then(val => {
        //     console.log('Version Check for 0.0.0 : ' + val);
        //   })
        //   .catch(err => {
        //     console.log('Version Check for 0.0.0 failed: ' + err);
        //   });

        // this.fsi.isLatestAppVersion('0.2.6')
        //   .then(val => {
        //     console.log('Version Check for 0.2.6 : ' + val);
        //   })
        //   .catch(err => {
        //     console.log('Version Check for 0.2.6 failed: ' + err);
        //   });

        // this.fsi.isLatestAppVersion('0')
        //   .then(val => {
        //     console.log('Version Check for 0 : ' + val);
        //   })
        //   .catch(err => {
        //     console.log('Version Check for 0 failed: ' + err);
        //   });

        // this.fsi.getAdminState();


        // this.fsi.logError('123456', 'Hi!');

        // this.logger.logUserInput('tester:delayMeBy3000');
        // console.log(Date.now());

        // this.renoveLastEmployee();
      });
  }

  private delayMeBy5000() {
    this.customDelay(5000,
      () => {
        console.log('tester delay 5s');
        // this.printPublicDpoData();

        // this.addLike100Emplyoees();

        // this.startSyncUsersAccesses();



        // const fsi_isAdmin = this.fsi.isAdmin;
        // console.log({fsi_isAdmin});

        // console.log('fsi.getAllEmployees()');
        // this.fsi.getAllEmployees()
        //   .then(val => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('All employeess');
        //     val.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   })
        //   .catch(err => {
        //     this.logger.logError('12749279', err);
        //   });


        // const usersEmployeeId = this.fsi.getUsersEmployee().docId;
        // console.log('getEmployeeAccesses of:');
        // console.log({usersEmployeeId});
        // this.fsi.getEmployeeAccesses(usersEmployeeId)
        //   .then(accesses => {
        //     console.log('getEmployeeAccesses');
        //     console.log(JSON.stringify(accesses));
        //   })
        //   .catch(err => {
        //     this.logger.logError('09955955', err);
        //   });


        // this.sub3 = this.fsi.syncEmployeeAccesses(
        //   usersEmployeeId,
        //   accesses => {
        //     console.log('syncEmployeeAccesses change');
        //     console.log(JSON.stringify(accesses));
        //   },
        //   err => {
        //     console.error(err);
        //   });
      });
  }

  private delayMeBy10000() {
    this.customDelay(10000,
      () => {
        console.log('tester delay 10s');

        // this.addRandomProject();

        // this.checkOnEmployees();
        // this.getAllEmployees();

        // const subs = this.fsi.syncAllEmployees(
        //   addedEmployees => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('addedEmployees');
        //     addedEmployees.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   },
        //   modifiedEmployees => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('modifiedEmployees');
        //     modifiedEmployees.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   },
        //   removedEmployees => {
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('removedEmployees');
        //     removedEmployees.forEach(employee => {
        //       console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //       console.log(employee.name);
        //       console.log(JSON.stringify(employee));
        //     });
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //     console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
        //   }
        // );
        // this.sub0 = subs[0];
        // this.sub1 = subs[1];
        // this.sub2 = subs[2];
      });
  }

  private delayMeBy60000() {
    this.customDelay(60000,
      () => {
        console.log('tester delay 1min');

        // this.sub0.unsubscribe();
        // console.log('unsubscribed sub0');
        // this.sub1.unsubscribe();
        // console.log('unsubscribed sub1');
        // this.sub2.unsubscribe();
        // console.log('unsubscribed sub2');
        // this.sub3.unsubscribe();
        // console.log('unsubscribed sub3');

        // this.logger.logUserInput('tester:delayMeBy1000_1');
        // console.log(Date.now());
        // this.logger.logUserInput('tester:delayMeBy1000_2');
        // console.log(Date.now());
        // this.logger.logUserInput('tester:delayMeBy1000_3');
        // console.log(Date.now());
        // this.logger.logUserInput('tester:delayMeBy1000_4');
        // console.log(Date.now());
      });
  }

  private createClientTest() {
    console.log('run createClientTest');
    this.dbi.fsi.setUpNewClient(
      'testtest123@filitime.com',
      'Test1!',
      // FsiService.generatePushId(),
      // FsiService.generatePushId(),
      'ger',
      'Blub123 AG',
      '555 555 55',
      'Peter Jackson'
    ).then(() => {
      console.log('createClientTest bene!!!');
    }).catch(err => {
      console.error('createClientTest fail');
    });
  }

  private startSyncUsersAccesses() {
    this.dbi.startSyncEmployeeAccesses()
      .then(() => {
        console.log('GUESS IT WORKED... DUNNO...');
      })
      .catch(err => {
        console.error('YEAH!!! FUCK THIS SHIT!!! 3... 2... 1... HEAD HIT WALL');
        console.error(err);
      });
  }

  private checkOnEmployees() {
    const empList = this.dbi.dpo.getEmployees();
    console.log( 'SO... THIS SHOULD CONTAIN SOME EMPLOYEES I GUESS...' );
    console.log(JSON.stringify(empList));
  }

  private getAllEmployees() {
    console.log('tryna do da getAllEmployees thing');
    this.dbi.fsi.getAllEmployees()
      .then(employees => {
        console.log('look at this, bitch! All the employees are here!');
        console.log(employees);
      })
      .catch(err => {
        console.error('GREAT!!! ANTOHER FUCKIN EEROR...');
        console.error(err);
      });
  }

  private addRandomEmployee() {
    return new Promise<void>((res, rej) => {
      const randomEmployee = this.buildRandomEmployee();
      this.dbi.fsi.addEmployeeToDB(randomEmployee, [], [['45lLcHommncEof54qYpq', true]])
        .then(() => { res(); })
        .catch(err => { rej(err); });
    });
  }

  private syncEmployeesForEver() {
    const addSub: Subscription = this.dbi.dpo.employeeAdd.subscribe({
      next: addedEmployee => {
        console.log({addedEmployee});
      }
    });

    const modSub: Subscription = this.dbi.dpo.employeeModify.subscribe({
      next: modedEmployee => {
        console.log({modedEmployee});
      }
    });

    const remSub: Subscription = this.dbi.dpo.employeeRemove.subscribe({
      next: remedEmployee => {
        console.log({remedEmployee});
      }
    });

    // setTimeout(() => {
    //   addSub.unsubscribe();
    //   modSub.unsubscribe();
    //   remSub.unsubscribe();
    // }, 10000);
  }

  private buildRandomEmployee(): Employee {
    const firstNames: string[] = [
      'Emma',
      'Mia',
      'Hannah',
      'Emilia',
      'Sofia',
      'Lina',
      'Anna',
      'Mila',
      'Lea',
      'Ella',
      'Clara',
      'Marie',
      'Lena',
      'Luisa',
      'Leni',
      'Leonie',
      'Johanna',
      'Emily',
      'Mathilda',
      'Amelie',
      'Frieda',
      'Charlotte',
      'Lia',
      'Sophie',
      'Ida',
      'Lilly',
      'Maja',
      'Greta',
      'Lara',
      'Laura',
      'Nele',
      'Lotta',
      'Sarah',
      'Melina',
      'Mira',
      'Nora',
      'Pia',
      'Elisa',
      'Paula',
      'Victoria',
      'Julia',
      'Marlene',
      'Lisa',
      'Juna',
      'Alina',
      'Pauline',
      'Isabella',
      'Maria',
      'Elena',
      'Helena',
      'Mara',
      'Luise',
      'Anni',
      'Luna',
      'Antonia',
      'Tilda',
      'Finja',
      'Thea',
      'Romy',
      'Theresa',
      'Isabell',
      'Ben',
      'Paul',
      'Leon',
      'Finn',
      'Elias',
      'Jonas',
      'Luis',
      'Noah',
      'Felix',
      'Lukas',
      'Henry',
      'Luca',
      'Maximilian',
      'Emil',
      'Theo',
      'Matteo',
      'Oskar',
      'Anton',
      'Jakob',
      'Max',
      'Liam',
      'Moritz',
      'Leo',
      'David',
      'Alexander',
      'Milan',
      'Julian',
      'Niklas',
      'Carl',
      'Philipp',
      'Tim',
      'Samuel',
      'Mats',
      'Tom',
      'Erik',
      'Linus',
      'Jonathan',
      'Mika',
      'Leonard',
      'Vincent',
      'Jona',
      'Jan',
      'Hannes',
      'Rafael',
      'Levi',
      'Fabian',
      'Aaron',
      'Jannik',
      'Simon',
      'Jannis',
      'Julius',
      'Johann',
      'Johannes',
      'Till',
      'Benjamin',
      'Adrian',
      'Joshua',
      'Lennard',
      'Nico',
      'Valentin',
      'Maxim',
      'Marlon',
      'Mattis',
      'Constantin',
      'Daniel',
      'Theodor',
      'Mohammed',
      'Luke',
      'Artur',
      'Ole',
      'Lenny',
      'Lian',
      'Florian',
      'Kilian',
      'Pepe',
      'Nick',
      'Fiete',
      'Milo',
      'Nils',
      'Toni',
      'Lio',
      'Sebastian',
      'Benedikt',
      'Adam',
      'Malte',
      'Phil',
      'John',
      'Timo',
      'Damian',
      'Gabriel',
      'Bruno',
      'Lias',
      'Levin',
      'Tobias',
      'Lasse',
      'Emilio',
      'Fritz',
      'Michael',
      'Carlo',
      'Matti',
      'Dominic',
      'Jannes',
      'Emilian',
      'Franz',
      'Noel',
      'Ludwig',
      'Leopold',
      'Lennox',
      'Oliver',
      'Joris',
      'Jayden',
      'Frederik',
      'Robin',
      'Joel',
      'Justus',
      'Alessio',
      'Malik',
      'Lars',
      'Nicolas',
      'Bennet',
      'Richard',
      'Sam',
      'Lenn',
      'Christian',
      'Elia',
      'Jonte',
      'Thilo',
      'Colin',
      'Bastian',
      'Enno',
      'Friedrich',
      'Luan',
      'Marc',
      'Piet',
      'Ilias',
      'Michel',
      'Charlie',
      'Lion',
      'Neo',
      'Hugo',
      'Matthias',
      'Silas',
      'Emir',
      'Ali',
      'Jamie',
      'Benno',
      'Lorenz',
      'Josef',
      'Thore',
      'Leandro',
      'Arian',
      'Tyler',
      'Yusuf',
      'Kian',
      'Arne',
      'Jaron',
      'Jason',
      'Bela',
      'Amir',
      'Dean',
      'Lionel',
      'Ferdinand',
      'Konrad',
      'Jasper',
      'Finnley',
      'Willi',
      'Manuel',
      'Henrik',
      'Victor',
      'Andreas',
      'Curt',
      'Marcel',
      'Tristan',
      'Leano',
      'Mailo',
      'Marvin',
      'Aiden',
      'Eddie',
      'Nathan',
      'Alex',
      'Gustav',
      'Connor',
      'Fabio',
      'Leonardo',
      'Thomas',
      'Yasin',
      'Elian',
      'Ömer',
      'Leonhard',
      'Aras',
      'Nikita',
      'Clemens',
      'Dennis',
      'Hendrik',
      'Diego',
      'Samu',
      'Georg',
      'Marco',
      'Martin',
      'Ian',
      'Maik',
      'Lino',
      'Magnus',
      'Mio',
      'William',
      'Mert',
      'Brian',
      'Hamza',
      'Xaver',
      'Eymen',
      'Janosch',
      'Lean',
      'Can',
      'Marten',
      'Tiago',
      'Elija',
      'Mick',
      'Patrick',
      'Albert',
      'Korbinian',
      'Leander',
      'Marius',
      'Nino',
      'Otto',
      'Edgar',
      'Bjarne',
      'Darian',
      'Antonio',
      'Wilhelm',
      'Henning',
      'Claas',
      'Janne',
      'Kai',
      'Dario',
      'Titus',
      'Ahmet',
      'Christoph',
      'Ibrahim',
      'Gregor',
      'Robert',
      'Carlos',
      'Jack',
      'Roman',
      'Stefan',
      'Markus',
      'Timur',
      'Nevio',
      'Miran',
      'Enes',
      'Laurens',
      'Marlo',
      'Mustafa',
      'Bilal',
      'Jano',
      'Younes',
      'Hans',
      'Omar',
      'Alan',
      'Leonas',
      'Alessandro',
      'Deniz',
      'Kaan',
      'Jakub',
      'Laurin',
      'Sami',
      'Erwin',
      'Mehmet',
      'Torben',
      'Armin',
      'Ayaz',
      'Darius',
      'Ilay',
      'Julien',
      'Peter',
      'Mikail',
      'Rayan',
      'Ruben',
      'Alwin',
      'James',
      'Milian',
      'Tammo',
      'Thies',
      'Yunus',
      'Hanno',
      'Mattes',
      'Ryan',
      'Josua',
      'Kjell',
      'Quirin',
      'Alfred',
      'Ensar',
      'Ivan',
      'Joscha',
      'Kevin',
      'Ragnar',
      'Jordan',
      'Kerem',
      'Maurice',
      'Mirac',
      'Valentino',
      'Ahmad',
      'Leonidas',
      'Youssef',
      'Umut',
      'Devin',
      'Emin',
      'Jaro',
      'Kalle',
      'Pascal',
      'Hassan',
      'Jeremy',
      'Logan',
      'Pius',
      'Chris',
      'Danny',
      'Emanuel',
      'Taylor',
      'Thorin',
      'Dylan',
      'Junis',
      'Nelio',
      'Caspar',
      'Jonne',
      'Kenan',
      'Pablo',
      'Amin',
      'Giuliano',
      'Selim',
      'Timon',
      'Vitus',
      'Yigit',
      'Antoni',
      'Aurelio',
      'Egon',
      'Kiyan',
      'Leif',
      'Tino',
      'Mahir',
      'Nikolai',
      'Andre',
      'Berat',
      'Efe',
      'Joost',
      'Kuzey',
      'Edwin',
      'Emre',
      'Jerome',
      'Jon',
      'Louie',
      'Marian',
      'Ricardo',
      'Rudi',
      'Eduard',
      'Keno',
      'Lutz',
      'Marek',
      'Sascha',
      'Tamme',
      'Amar',
      'Azad',
      'Eren',
      'Loris',
      'Tjark',
      'Angelo',
      'Damien',
      'Fred',
      'Jarno',
      'Jim',
      'Johnny',
      'Karim',
      'Mario',
      'Romeo',
      'Tamino',
      'Atilla',
      'Bosse',
      'Cedric',
      'Christopher',
      'Hector',
      'Miko',
      'Samir',
      'Sandro',
      'Francesco',
      'George',
      'Ilja',
      'Jamal',
      'Jesse',
      'Mattia',
      'Merlin',
      'Vito',
      'Levent',
      'Lucien',
      'Malek',
      'Taha',
      'Tillman',
      'Adem',
      'August',
      'Björn',
      'Danilo',
      'Domenic',
      'Eliano',
      'Semih',
      'Tommi',
      'Veit',
      'Arno',
      'Arvid',
      'Baran',
      'Dion',
      'Giuseppe',
      'Jari',
      'Jarne',
      'Leonid',
      'Levian',
      'Adriano',
      'Alexandros',
      'Arik',
      'Aurel',
      'Dante',
      'Miro',
      'Quentin',
      'Sinan',
      'Abdullah',
      'Anas',
      'Ansgar',
      'Aryan',
      'Etienne',
      'Hauke',
      'Ismail',
      'Jake',
      'Juri',
      'Koray',
      'Kuno',
      'Matei',
      'Rune',
      'Said',
      'Falk',
      'Flynn',
      'Hüseyin',
      'Isa',
      'Nael',
      'Noar',
      'Yunis',
      'Amon',
      'Anthony',
      'Cem',
      'Enzo',
      'Fatih',
      'Heinrich',
      'Joe',
      'Lorenzo',
      'Musa',
      'Poyraz',
      'Taylan',
      'Benny',
      'Berkay',
      'Bo',
      'Enrico',
      'Lewis',
      'Miguel',
      'Nilas',
      'Salvatore',
      'Alois',
      'Casper',
      'Cinar',
      'Damon',
      'Ege',
      'Eray',
      'Imran',
      'Issa',
      'Jackson',
      'Jean',
      'Kerim',
      'Lucian',
      'Mason',
      'Mino',
      'Peer',
      'Rocco',
      'Santiago',
      'Zayn',
      'Arda',
      'Ari',
      'Georgios',
      'Giovanni',
      'Halil',
      'Hussein',
      'Ioannis',
      'Kimi',
      'Mikael',
      'Nathanael',
      'Prince',
      'Severin',
      'Sven',
      'Taim',
      'Tizian',
      'Amadeus',
      'Artjom',
      'Christiano',
      'Dave',
      'Edin',
      'Jay',
      'Jimmy',
    ];
    const lastNames: string[] = [
      'Müller',
      'Schmidt',
      'Schneider',
      'Fischer',
      'Weber',
      'Meyer',
      'Wagner',
      'Becker',
      'Schulz',
      'Hoffmann',
      'Schäfer',
      'Koch',
      'Bauer',
      'Richter',
      'Klein',
      'Wolf',
      'Schröder',
      'Neumann',
      'Schwarz',
      'Zimmermann',
      'Braun',
      'Krüger',
      'Hofmann',
      'Hartmann',
      'Lange',
      'Schmitt',
      'Werner',
      'Schmitz',
      'Krause',
      'Meier',
      'Lehmann',
      'Schmid',
      'Schulze',
      'Maier',
      'Köhler',
      'Herrmann',
      'König',
      'Walter',
      'Mayer',
      'Huber',
      'Kaiser',
      'Fuchs',
      'Peters',
      'Lang',
      'Scholz',
      'Möller',
      'Weiß',
      'Jung',
      'Hahn',
      'Schubert',
      'Vogel',
      'Friedrich',
      'Keller',
      'Günther',
      'Frank',
      'Berger',
      'Winkler',
      'Roth',
      'Beck',
      'Lorenz',
      'Baumann',
      'Franke',
      'Albrecht',
      'Schuster',
      'Simon',
      'Ludwig',
      'Böhm',
      'Winter',
      'Kraus',
      'Martin',
      'Schumacher',
      'Krämer',
      'Vogt',
      'Stein',
      'Jäger',
      'Otto',
      'Sommer',
      'Groß',
      'Seidel',
      'Heinrich',
      'Brandt',
      'Haas',
      'Schreiber',
      'Graf',
      'Schulte',
      'Dietrich',
      'Ziegler',
      'Kuhn',
      'Kühn',
      'Pohl',
      'Engel',
      'Horn',
      'Busch',
      'Bergmann',
      'Thomas',
      'Voigt',
      'Sauer',
      'Arnold',
      'Wolff',
      'Pfeiffer',
    ];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomSecondName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    const randomName = randomFirstName + ' ' + randomSecondName + ' ' + randomLastName;

    let randomId = '';
    for (let i = 0; i < 6; i++) {
      randomId += (Math.floor(Math.random() * 5));
    }

    const returnValue = new Employee(
      undefined,
      randomId,
      randomName,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    );

    return returnValue;
  }

  private buildRandomProjectData(): {} {
    const nameList =
      ['Buchholz',
        'Buhlick',
        'Burkhardt',
        'Burlacher',
        'Bürotag',
        'Campos',
        'Centric',
        'Cladi Glunz',
        'Conrad, Grünlingweg 4 (R)',
        'Czech',
        'Daiber',
        'DeVries/Maier',
        'Dehn',
        'Dipper',
        'Dobbratz',
        'Dreessen',
        'Drossard',
        'Duffner',
        'Eger',
        'Ehm',
        'Ehmann',
        'Engelfried',
        'Ergenzinger',
        'Ettischer',
        'Ev. Kirchengemeinde',
        'FEIERTAG',
        'Faerber',
        'Federsel',
        'Fekecs',
        'Fentsahm',
        'Fischer',
        'Forststr 140',
        'Frank',
        'Frankenhauser / Rockenstein',
        'Frech/Piga',
        'Frech/Wagner',
        'Frey - Fissler Post',
        'Frisuren im Asemwald 48',
        'Fünfgeld',
        'Ganser',
        'Gauder',
        'Gauder Bismarkstr',
        'Gauthier',
        'Gauthier Küche',
        'Gayko',
        'Geiges',
        'Gerber',
        'Gerhard',
        'Ges. Kirchemgem. Heumaden',
        'Gesamtkirchengemeinde',
        'Girolamo Gullo',
        'Gohl',
        'Gohl Martin',
        'Grabendörfer',
        'Grau',
        'Greiner',
        'Grieb',
        'Grimminger',
        'Grohme -Raff San',
        'Grässler',
        'Gutzeit',
        'Gölkel',
        'Gösele',
        'Göser Rekla',
        'Götze',
        'Haargalerie Beinhoff',
        'Haas',
        'Hachmeister',
        'Hainbuchenweg 31 WG Wurz',
        'Hansen/Haug',
        'Hardekopf',
        'Harm Whg Kovac',
        'Harnisch',
        'Harnisch Büro',
        'Hartmann',
        'Hau',
        'Haug - Musterraum',
        'Haug Waldstr. 37A',
        'Heck c/o Harnisch',
        'Heim',
        'Heinemann',
        'Heinemann Putz',
        'Hellmiß',
        'Helzle'
      ];
    const noteList = [
      // tslint:disable-next-line:max-line-length
      'Epplestr. Praxis Kögel Fliesen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EvMAdCWUvsVJnaO9rAsf_CABecrxy5ID-c54DmgRD7EgOw?e=kU8grD ',
      // tslint:disable-next-line:max-line-length
      'Epplestr. 1B Fassadensanierung +49 176 10216882 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EjtL3u9ixMBCue1ke4jRZ8MBX5mGnxqcesgvboVrCeibGA?e=zsUVQv Teams: https://teams.microsoft.com/l/team/19%3ad133a9ad8b7d42658c2c96c351da6370%40thread.skype/conversations?groupId=45917cd2-445a-44be-a9cd-13c0a1a54fe8&tenantId=148e1261-e638-4905-a07f-81f5e0358b2f',
      'Epplestr. 23 Bürofenster Riss Ameisen',
      // tslint:disable-next-line:max-line-length
      'Epplestr. 44 Malerarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EuVpjNPH1q9DkdR2Ew8wcUEBle1ouq54MHlLV-ABN307QQ?e=DrDsPw ',
      // tslint:disable-next-line:max-line-length
      'Epplestr. 44, 2.OG Malerarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EvphvuwnqK9AoL8CfRfuMXQBi4qk3I3sQRYqQLNLXO1ZUw?e=x2Ker0',
      // tslint:disable-next-line:max-line-length
      'Epplestr. 70 Fassade Ausbesserung 30 Tage Balkone Fliesen 7 Tage https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EosqsqhTlfBLoCQD8PFdNB4BZ0DCfJZ3JwJdyfdka98t6A?e=CPxeRj Teams: https://teams.microsoft.com/l/team/19%3a6e9458651e4049b892a34da0a2602eea%40thread.skype/conversations?groupId=3254ffc0-4cd4-4735-96ea-cd60ca138268&tenantId=148e1261-e638-4905-a07f-81f5e0358b2f',
      // tslint:disable-next-line:max-line-length
      'Erlenweg 14 Balkonstützen aus Holz lasieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eogeci37UbxElba2jF2KMXIBotNB3EdZ7aStJONIQAXZ1w?e=RzxlJn',
      // tslint:disable-next-line:max-line-length
      'Erwin Bälz Str. 49 Bad WC Fliesen 7 Tage Maler 1 Tag https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eu5Iu-x2jtNAp3Bh_7DbA-UBZs0Fgh_76RZF4-xQfjBmGA?e=18jrgc Teams: https://teams.microsoft.com/l/team/19%3ac6153714678d40d38197ede3581d1b56%40thread.skype/conversations?groupId=598ce0a9-7b88-44aa-885d-4ccaaa0ce355&tenantId=148e1261-e638-4905-a07f-81f5e0358b2f',
      // tslint:disable-next-line:max-line-length
      'Erwin-Bälz Str. 45 Türrahmen und -blätter https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EqhDQPKUn-xAg5DmSeSRSOoBRm0X1fZzwsRZTjd-HFHvBA?e=NN0z6t Fotos: https://photos.app.goo.gl/mL7A9jVM8khggrzM7',
      // tslint:disable-next-line:max-line-length
      'Estrich erneuern/ Nacharbeiten am 06.12.2018 Boden ausfugen Fugenfarbe Steingrau 18 Treppenstufen schleifen/polieren Sockel innen weiß streichen Fr. Buciek ist vom 16.11.-30.11.2018 im Urlaub ',
      'Estrich gießen',
      // tslint:disable-next-line:max-line-length
      'Falkenstr. Maler Parkettgrundreinigng https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/ElnvgCgJkY1Hm5aki6F7Z6wBr1L2fcGyZyHTmQUVp1wzAw?e=BFypw6',
      // tslint:disable-next-line:max-line-length
      'Falkenstr. 8, 70597 Stgt. Malerarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EpdLZZdt_xxCqy7AmyXkE6IBy4JFuJUnEHZSzlww88TkAQ?e=vfuFe1',
      // tslint:disable-next-line:max-line-length
      'Fasanenhof 59 DG Wasserflecken sanieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EqI3_FvmIjlGmDaG0_wYXJYBFvI2rahxuiJRzSKV9GB2yw?e=VQXpVv',
      'Fassadenanstrich 270m2 Fenster 14m2 Bockelstr. 19',
      // tslint:disable-next-line:max-line-length
      'Felix Dahn Str. 64b Balkon Streicharbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EpaLlotqChdAvyg_dd7S0KUBvnq2KUqFG2POdyil3x8iGA?e=z33fiG ',
      // tslint:disable-next-line:max-line-length
      'Felix Dahn Str. 9d Terrasse Wintergarten Maler https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EsaV_wuPb2hKqraSTGHKd7kBmPq53R6Mt85lyQdLKJv0Tw?e=7oTauR',
      // tslint:disable-next-line:max-line-length
      'Felix-Dahn-Str. 13 A Reparatur Zwischentür im Eingangsbereich https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EgQUXz6UNjpAg19caWuF2TIB_frHEnfxgZzZdcVRWqbNCQ?e=yCCdVj',
      'Fenster',
      'Fenster ausbesser, Heizungskeller ein Loch zuputzen',
      // tslint:disable-next-line:max-line-length
      'Fenster in der Küche lackieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/ErIk_QFuPVxPnjeU9O_03j0B8u7ZKlhikDyXUPs2bdCuUg?e=zq60cS ',
      // tslint:disable-next-line:max-line-length
      'Fenster lackieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Emv1aHvxcXlMoyc5Sl1jAf8B5RxPqonlw4kV0eYiLAvD1g?e=XaS2SI ',
      'Fensteraußenseiten-Füllstabgeländer-Balkonsäulen Heinestr. 141b 01701857540',
      'Fensterreklamation /o Jung Immob.',
      // tslint:disable-next-line:max-line-length
      'Filderbahnstr. Möhringen Haustüre einputzen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EiPrE-i4atVHlHDJfPW3ptgBXD3pS_-xnKXuG0etMalo8Q?e=LTld1W',
      'Filderhauptstr. 209 11 Stock 2. Arbeitsgänge Risssanierung in der Dusche ',
      'Fistermine am 18.04.19 nochmals vom KD bestätigt Gartenstr. 28, Gerlingen Risssanierung ',
      // tslint:disable-next-line:max-line-length
      'Fixtermin https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Ejr4HE69g5pAlIgA1UJ5aYYBa9i4NdlJuun0orJgDzQpOA?e=SfxXsb',
      // tslint:disable-next-line:max-line-length
      'Fixtermin 17.09.18 Gerüstaufbau Kurz 14.09.18 Bau-WC Dixi Scillawaldstr. 75 07119978594 Fassade Fachwerk und Neuverputz 19.7 Termine teilt HG mit',
      // tslint:disable-next-line:max-line-length
      'Fixtermin Alte Dorfstr. 15 Treppenhaus https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/ElKQnOyAwm5AiTvSdKypg0QBL4dn9-y3eleMz-I68X_q2A?e=OMpfhw',
      'Fixtermin Feinputz /Fensterelement',
      'Fixtermin Flur mit Vinyl legen Im Asemwald 32/16',
      // tslint:disable-next-line:max-line-length
      'Fixtermin Maler und Fliesen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EvUp8ahx0pNGm2e7K53GOPkBBWAx4z0MDOJckL2MarsWVA?e=uYXcSW ',
      // tslint:disable-next-line:max-line-length
      'Fixtermin Rapportstunden! Fassade-Entlüftungsgitter-Balkonfleisen Fasssaden neuverputz und Betonsan kalk: 1000 Std Balkone: 155 Std https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EokQAROP9cFMpPgznHMAbr4BLtTefCpDU5aR3QhluVCJ_Q?e=6kgGPO',
      // tslint:disable-next-line:max-line-length
      'Fixtermin 1. 1,5 Std Putzausbesserung 2. 6,5 Std Streicharbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhTWavnfsPdEp3mNilNR2J4BYVtb2uEqUAUA8CE6Lzae5g?e=jASK0q',
      // tslint:disable-next-line:max-line-length
      'Fixtermin Diemershaldenstr. 20, Fliesen UG, Badumbau mit Volk, Ansprechpartner Nichte Frau Lutz https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EkOo7p6ZXQxGq-Worxh4LnwBJfe5rKhdBQln3ZI0M3u73A?e=oMgD6h',
      // tslint:disable-next-line:max-line-length
      'Fixtermin Parkett pflegen Paracelsusstr. 33 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Esaw-GUn6DVCsbCylg7Fg-8BccusivVaPQ3B59KgHn_2ZQ?e=FMqKsQ ',
      // tslint:disable-next-line:max-line-length
      'Fixtermin Roßbergstr. 39 Haussockel Am 30.04. kommt Herr Reschke aus Heilbronn auf die Baustelle Wenn möglich sollte der letzte Termin 10.05 vorverlegt 06.05. werden https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Es3EF0nvS4RLrlXmD860BGcBKPwNdl_JQ_IJlKjqzKrXfA?e=tgIhpJ',
      // tslint:disable-next-line:max-line-length
      'Fixtermin! Ornamenttapete / Zimmer mit leichter Schräge an Decke Stuckleiste anbringen',
      // tslint:disable-next-line:max-line-length
      'Fixtermin: KD ist im Urlaub, gibt Schlüssel im Büro ab. Bei Beendigung der Arbeiten Schlüssel auf dem Wohnzimmertisch liegen lassen. Reutlingerstr. 102 Schimmelsanierung/Wohnung streichen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EklI5372P-FKra_v7QZ5Ia0BsF8gb8PcpApLdsfg2zdQpQ?e=wUFQcx',
      // tslint:disable-next-line:max-line-length
      'Fixtermin: Perlgrasweg 34 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eiquvf7BUJRCrWwwfInnN-UBmfEo0gcw5wSj0Qa_luhW5A?e=RQy5CF',
      // tslint:disable-next-line:max-line-length
      'Fixtermin: Schimmelsanierung Tel Frau Wurz 0711763637 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EkpmlaIB0JpNiUffXBSusG8Bv2GTE9FuLU7gxDBGpR8-TQ?e=pTSPXL',
      // tslint:disable-next-line:max-line-length
      'Fixtermin: BV Birkach Parkettversiegelung https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/ElL7naNLZ81Ov5ZhSWSkT9oBLvusULUQh2tdWeZr7E02ew?e=hAxVQ9',
      // tslint:disable-next-line:max-line-length
      'Fliesen 15 Std Putzausbesserungen 2 x 4 Std Altenbergstr. 54 071539395537',
      // tslint:disable-next-line:max-line-length
      'Fliesenarbeiten im Treppenhaus https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Enxh5u8moiFEr4sWyU8eJA8B6rX00QOysneMpIeJUoOd7Q?e=hZ9FtJ ',
      // tslint:disable-next-line:max-line-length
      'Fliesendemo/ neu Fliesen Flügeltüre lackieren HW Neumeier https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EkNar5EFosJAuBJai9nU0vYBBMmzGGTxMqPHWhHGHBNTvg?e=ZtgGSq',
      // tslint:disable-next-line:max-line-length
      'Fliesenschäden Kurt-Schumacher-Str. 135 7156973 Auf Abruf Rockenstein',
      // tslint:disable-next-line:max-line-length
      'Flur, Küche,Essbereich evlt noch kl Zimmer Rauhfaser tap und streichen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EuxwDpCZozBHgseB-NLEGMcBcToIvEYiwlB1lLSlUY-svA?e=fa3K6K ',
      // tslint:disable-next-line:max-line-length
      'Frauenkopfstr. 56 Lackieren Türblatt https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Ek3_bgBCZxlIuD4APNtNiMEBAUuHIsZcpXWBO0HRPf_6pw?e=uKLDj4 ',
      // tslint:disable-next-line:max-line-length
      'Fridingerstr. 9a Putzsanierung drei Arbeitsgänge Fensterfasche ausbilden https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EuhL4TuuDSJFkQ5Q_wvAvQ8B41QrHpVRFAG457GZWysc3g?e=YajcyR',
      // tslint:disable-next-line:max-line-length
      'Friedrichstr. 26 70771 Leinfelden Echterdingen Komplettreno https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eq7stXHuJCVGkE_mmtJV18UBexB7UIGKjlUd6_C-_7lTvA?e=37Zdut ',
      // tslint:disable-next-line:max-line-length
      'Fugen nachziehen',
      // tslint:disable-next-line:max-line-length
      'Gablenbergerhauptstr. 21 4. Stock Laminat verlegen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eu4BajpHYdtCqBneoMjXgpMBYGJ-zE2Rm7RX8c7JV5qeKw?e=y9sX80 Fotos: https://photos.app.goo.gl/TSmjZvS5PdzTHeDf8',
      // tslint:disable-next-line:max-line-length
      'Gamerdingerstr. 4b Möhringen Küche tapezieren und streichen Besichtigungstermin HG 03.06. Fliese Küche Bad 26.06. fertig Kücheneinbau 27.06. https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EpnFrNH0hZNKjvWgzAc1TIgBW7jnqrukmg-wvjWobRlwdQ?e=ZpBXrq ',
      // tslint:disable-next-line:max-line-length
      'Garagentore streichen Löwenstr. 63 Fr. Fröhling Tel. 0160/1846223 Schlüssel bringt Frau Fröhlich ins Büro , wenn Bv fertig ist am Dienstag Schlüssel bei Fr. Fröhlich wieder abgeben https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Ei6spIAOgV1KuOgnD90gzKEBacqHfz7EeeIV8JUKPGtYqg?e=YN1d4g ',
      // tslint:disable-next-line:max-line-length
      'Gebrauchsspuren Praxis entf. Sonnenbergstr. 12 https://malergiese-my.sharepoint.com/:t:/g/personal/info_malergiese_onmicrosoft_com/EY0YQqanAfpNrKNHSS1fyN4BX8f4iylWZKooY12u3utNVQ?e=EJ0jTt ',
      // tslint:disable-next-line:max-line-length
      'Gellertstr. 6, 70184 Stuttgart https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EghG2tTMrkpAq1WRG9wuCDcBUuu98vfPFKIz9vvqaDCIzw?e=zRWnQ9 Dachgesims lackieren Termine durch HG mitgeteilt. Gerüstaufbau am 6.5',
      // tslint:disable-next-line:max-line-length
      'Gemeindehaus Grüningerstr. 25 Schadstellen Parket https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EilX8RjfgFROl0G8ebR_jTUBy1nySBeJx22k7ibHWtMaEw?e=fAxt9Z',
      // tslint:disable-next-line:max-line-length
      'Gomaringer Str. 28A Außenwand Salpeter Anstrich https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EnHi8NodaFRFplFgMsLzXsgBgoXRrBSdmFOA3LRPAk8GEA?e=KimQae ',
      // tslint:disable-next-line:max-line-length
      'Gr. Falterstr. 99 Parkettboden schleifen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EqkpkLOMcCpJtjXbZisVQ4sB6I5cBe_j3y-DraKFRbXczw?e=GKzdxq',
      // tslint:disable-next-line:max-line-length
      'Grobe Untergundvorbereitung 45 Std Anstrich Decke Wandflächen 3 Manntage https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EqZ5F_3LC6pAsoGNsk_JjHsBBFBX3QV2JEAYFoqVaybgpQ?e=SvU9cv',
      // tslint:disable-next-line:max-line-length
      'Große Falter Str. 3 Verputzarbeiten',
      // tslint:disable-next-line:max-line-length
      'Große Falterstr 29/5 760196',
      // tslint:disable-next-line:max-line-length
      'Gämswaldweg 25 Garagentor https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EjCfJ6NAiZlAlBIRrfD--1kBZ-i4AJkt8AlFnwrLTlOSEw?e=N3BXWr',
      // tslint:disable-next-line:max-line-length
      'Günterstr. 12 Sockel aussen 3 Simse https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EqBnShlfOCVNpcbeHn8sZEcBOR2ErsG1Z7Xnayj4M3M3qQ?e=b5CABC ',
      // tslint:disable-next-line:max-line-length
      'HG Klären ob Zeit reicht Termin mit KD besprochen 15 qm Teppich verlegen + Läufer anfertigen lassen',
      // tslint:disable-next-line:max-line-length
      'HW Hewig Betonunterkonstruktion san. Treppensanierung Rapportarbeit!! https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhJok63VBzpGlYhdAuCmaJMB6f4_1bPothGDOAsCEb8aCA?e=l7KL5z',
      // tslint:disable-next-line:max-line-length
      'Haargalerie Rotebühlstr. 109 Lackierarbeiten Fenster https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EoKj6zw8-_9FmsgfK1l9Gu4B9rdqFEhUagv74gNarOWL3w?e=OwWKlU Fotos: https://photos.app.goo.gl/pg1frA31syhGBYTp6',
      // tslint:disable-next-line:max-line-length
      'Hagdornweg 9 Fliesen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EpO35Me7U75DnkKpY-pVG-4BsUfrjJ1VefwoJnabUWAbjw?e=UBPdJl Fotos: https://photos.app.goo.gl/8qmrs4X5kkiQn9L97',
      // tslint:disable-next-line:max-line-length
      'Hainbuchenweg 20d Garagentor, Stück von Zaun und Gartentor streichen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eur9rKU4EsZDtBxfvqUg86wB8fE8BOE_2DED_hBcw0cn3Q?e=DybcUg Fotos: https://photos.app.goo.gl/PVY3Annns35o7EEZ9',
      // tslint:disable-next-line:max-line-length
      'Hainbuchenweg 22 Div. Malerarbeiten Teil1: Pos 1.1 /1.2 /3 /5 / 6 v. 03-05.04.19 4 Tage Teil2: Pos 1.3/ 2./ 4. Ausf.-Termin noch planen. Tel KD; +491725890186 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EpLI162KxA1KkJe-5zeUa-4BenDOa6D8Cw7GcvZhei1lyA?e=ZF1S0V',
      // tslint:disable-next-line:max-line-length
      'Hainbuchenweg 7 Malerarb. Tel. 01704857101',
      // tslint:disable-next-line:max-line-length
      'Hainbucheweg 3 Gästedusche https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eh-hv-HxRU9LkJxvY6klTG0BfSwTUwIADi4QSQQ9GFWg0g?e=J7N4OT ',
      // tslint:disable-next-line:max-line-length
      'Hasenstr. 47 Küchenumbau Maler + Trockenbau https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/ElMPrExWm55ApzAEb86DEQMBrZxZkk1UDtgcJ2lHHlgpZg?e=E8TWgk',
      // tslint:disable-next-line:max-line-length
      'Haustüre und Türen in der Werkstatt lackieren. Herr Ogus liefert Türen an Tel. 017622251409 ',
      // tslint:disable-next-line:max-line-length
      'Heerstr. 19b, Mauerer/Verputz/Spachtelarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/ErUjEX8uouNCulAXj4oBHFgB-HKbOhdC33tgVsHsvkp0dg?e=qGEPhC',
      // tslint:disable-next-line:max-line-length
      'Heizungsraum',
      // tslint:disable-next-line:max-line-length
      'Helbingstrasse 23 Wasserschaden Dachfenster Beschichtung Abfluss https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EnFmedJCdEZIqaYL8X0tnroBx8JyXuNQIfjtXfrpF3L7Bg?e=lg0p6m Fotos: https://photos.app.goo.gl/1Mn6qUVheYPAk89A9',
      // tslint:disable-next-line:max-line-length
      'Herdweg 77 Parkett schleifen und lackieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EquiEEdaFuRPuG36hpkLGEEB3s2ZGNio_2gv-A2LSEilTA?e=IPcGZz',
      // tslint:disable-next-line:max-line-length
      'Herz-op im September / Anrufen ab 15.10.19 ob Termin möglich ! Epplestr. 34 Garagentore Eistentür /Zaun https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EkKIvIqdP-VOqxj91jCLlysBUZOe_tztz78Tk1HyLLwCLw?e=yXJY0p',
      // tslint:disable-next-line:max-line-length
      'Hoffeldstr. 206e Pergola Fensterläden https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EmXyBvRP7_ZGjaISULThbE4B8j-ZjkRO_tCKm5T6-ZzQjA?e=VvHosS',
      // tslint:disable-next-line:max-line-length
      'Hoffeldstr. 215 / Balkonbelag Entweder Teppichbelag zuschneiden oder Boden streichen',
      // tslint:disable-next-line:max-line-length
      'Hoffeldstr. 246 Garagentore https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhdL_28vYcRKiXs4BtS5_dcBlz7541tc2iDxXADeSe3W9w?e=fa9HBZ Fotos: https://photos.app.goo.gl/hoTjhoShQ6TD9dWY6',
      // tslint:disable-next-line:max-line-length
      'Hoffeldstr. 78 17,5 Rapportstd https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Em-5n21zYFZJkAwrecGOhUoBoG1HwSxu_MZM8BXvFZdkow?e=Va0VPf',
      // tslint:disable-next-line:max-line-length
      'Hr. Ganser ist im Urlaub vom 07.04-17.04.2019 Daimlerstr. 20 Pliezhausen Wasserschadensanierung Schlüssel wurde im Büro abgegeben https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EvmplaXrMXpOluzp2dApIyABrNeN_dmMpdACNjWT51vylw?e=nwoIVd',
      // tslint:disable-next-line:max-line-length
      'Hr. Klier von PVS nur die KW mitgeteilt nicht der Tag! Julius-Hölder-Str. 47 Sanierung Laderamoe',
      // tslint:disable-next-line:max-line-length
      'Hölzleswiesenstr. 34 Verschiedene Verputz und Malerarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EobiGJaMJApBujLkljuyBvgBS0DrtNbkxEguDaNprcmIKQ?e=GYjIXZ',
      // tslint:disable-next-line:max-line-length
      'Im Asemwald 24/21 Estrich sanieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhZTgQtt4VdMlxcpkqSYGjcBDqCiT-CWVQ9ubYEgG50weQ?e=Gma7Za',
      // tslint:disable-next-line:max-line-length
      'Im Asemwald 32 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhNp72gxRE1FpVzDQLML5OUBrhE_zEQESoT5JctBq-nKbA?e=mmzTPg',
      // tslint:disable-next-line:max-line-length
      'Im Asemwald 60/11 Mietwhg Boden erneuern https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eg_dJKDDDVFBu_LAi1uHWKQBEOWL423xtO3yk_h8O-9lFw?e=4Fb6Nv Fotos: https://photos.app.goo.gl/EZPt3EHQBwzMMReA6 ',
      // tslint:disable-next-line:max-line-length
      'Im Wolfsberg 13 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhK9kzGzoM9GsaTbzDKIq6YBrXxUyi9R5CLDrsLlDBd_Fw?e=sPzJyf',
      // tslint:disable-next-line:max-line-length
      'Im Wolfsberg 13 Malerarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EgXOi9DpnWZHkVaQaCo3G2cBeArIJmTBilo0U_pK3LAKZw?e=wruyec ',
      // tslint:disable-next-line:max-line-length
      'Immenhofer Str. 92 70180 Stuttgart Holzhaustüre lackieren https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Eioiscd2s7lJoWmfxEoqsOcBylkOO-ePBlyI53rpNOhznQ?e=f1Lbv7 ',
      // tslint:disable-next-line:max-line-length
      'In der Falterau 13 Fliesenspiegel im Keller https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/En7UzZNV9WxBiV2cUPsSN9UB6UjywZmUBZHIIJDEWnSjwA?e=6w8f7d ',
      // tslint:disable-next-line:max-line-length
      'Innenputz ausbessern+Streicharbeiten Hofgärten 9a 0157-32120916 Protokoll: 22.10: Frau Schumann hat sich bis jetzt noch nicht gemeldet 25.10 Tel mit Frau Schumann , Terminiert auf 12.11. wenn mögl. 9.11. Bodenbelag ergänzen - Parkett, bzw Provisorium. nächstes Jahr evtl Spachtelboden Wenn mögl. Estrich prüfen. 30.10 Anruf von Frau Schumann bei Frau Eberle, Aicher wird nicht fertig, Arbeiten verschoben auf Frühjahr, KD meldet sich wieder. ',
      // tslint:disable-next-line:max-line-length
      'Innenverkleidung Dachfenster herstellen Erwin-Bälz-Str. 49 7655467 ',
      // tslint:disable-next-line:max-line-length
      'Isolde Kurz Str. 36 Tel. 01717524641 EG Maler innen https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Ekuy9C4kcSVDqwuTSO2T1kcBL7u-6a1H8QOXTygAzk5whw?e=S4Nt1q ',
      // tslint:disable-next-line:max-line-length
      'Jahnstr. 43 Div. Ausbesserungsarbeiten https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EhV4aaWiVq1OqP7iEHfrRMcBLEbvTliyZyr-suKLdToxhA?e=QecYq4 ',
      // tslint:disable-next-line:max-line-length
      'Johannes Krämer Str. 67 Treppenhausrenovierung https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/EgZW6T8bmQRGu2uDJvmEiFoB7uZyNc2PBQ3CH-gYK8tTaA?e=lHpzQX Teams: https://teams.microsoft.com/l/team/19%3a57728e9609f1469a802f55dd7995b305%40thread.skype/conversations?groupId=1259a62d-88a5-4e96-b87c-7c7f53a3d081&tenantId=148e1261-e638-4905-a07f-81f5e0358b2f',
      // tslint:disable-next-line:max-line-length
      'Johannes-Krämer-Str. 73 AG von Schlosserei Göller vermittelt',
      // tslint:disable-next-line:max-line-length
      'Julius-Höler-Str. 33 https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Ei9TdhJ_TrNKhnp_zVXsPY0BcdiBJFgGRuwsm4ofFA1GKg?e=8R3Lzv',
      // tslint:disable-next-line:max-line-length
      'KD 12378 hat undichte Fugen. Hoffeldstr. 246. Rapportauftrag. muss noch geschrieben werden. Termin KD mitgeteilt. Fugen an der Badewanne erneuern.',
      // tslint:disable-next-line:max-line-length
      'KST 1008 Fassadenfarbton: Sikkens Farbton F6.05.70 Putzsanierung + Anstrich Aussenfassade Zeppelinstr. 87 70193 Stgt 22.11: Telefonat mit Herrn Heil, Zimmermann/Dachdecker hat jetzt erst begonnen Zimmermann macht Montag Dienstag das Traufgesims fertig, wir können ab Mittwoch starten. Um 10 kommt Herr Heil mit Bauherr Bilder: https://malergiese-my.sharepoint.com/:f:/g/personal/info_malergiese_onmicrosoft_com/Ei8TRI2IOuFGhl0YYVoBfu0Bz91ZBPjT2M8x9VvnDFoqgQ?e=vdsVge',
      // tslint:disable-next-line:max-line-length
      'Kabelschlitz schließen'
    ];

    let randomName = nameList[Math.floor(Math.random() * nameList.length)];
    randomName += ' | ';
    for (let i = 0; i < 3; i++) {
      randomName += (Math.floor(Math.random() * 10));
    }

    let randomId = '';
    for (let i = 0; i < 6; i++) {
      randomId += (Math.floor(Math.random() * 10));
    }

    const randomDuration = Math.floor(Math.random() * 28 + 4) * 8 * 60;
    const randomColor1 = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    const randomBoolean1 = Math.random() >= 0.5;
    const randomColor2 = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
    const randomBoolean2 = Math.random() >= 0.33;
    const randomNote = noteList[Math.floor(Math.random() * noteList.length)];
    const randomBoolean3 = Math.random() >= 0.5;
    const randomBoolean4 = Math.random() >= 0.5;

    let randomFolder = 'Ordner';
    for (let i = 0; i < 2; i++) {
      randomFolder += (Math.floor(Math.random() * 10));
    }
    randomFolder += '|19';

    return {
      identifier: randomId,
      name: randomName,
      duration: randomDuration,
      endless: false,
      allocatedTime: 0,
      isConflicted: false,
      color: randomColor1,
      marker: randomBoolean1 ? randomColor2 : null,
      markerColor: randomBoolean1 ? randomColor2 : null,
      note: randomBoolean2 ? randomNote : null,
      reserved: randomBoolean3,
      // blockCode: undefined,
      finished: randomBoolean4,
      folder: randomFolder,
    };
  }

  private addRandomProject() {
    console.log('addRandomProject call');
    const blubData = this.buildRandomProjectData();
    this.dbi.addProjectToDB(
      // tslint:disable:no-string-literal
      blubData['identifier'],
      blubData['name'],
      10,
      false,
      blubData['color'],
      (blubData['marker'] ? blubData['marker'] : null),
      (blubData['marker'] ? blubData['marker'] : null),
      blubData['note'],
      blubData['reserved'],
      blubData['folder']
      // tslint:enable:no-string-literal
    ).then(() => { console.log('guess adding project worked'); }
    ).catch(err => {
      console.error('shityfuck: ' + err);
    });
  }

  private async addLike100Emplyoees() {
    for (let i = 0; i < 100; i++) {
      await this.addRandomEmployee();
      await this.iPromiseIllWait(1000);
    }
  }

  private iPromiseIllWait(waitTime: number): Promise<void> {
    return new Promise<void>((res) => {
      setTimeout(() => { res(); }, waitTime);
    });
  }

  private addNextEmployee() {
    const selectedList = this.wvs.getSelectedEmployeeNames();
    const selectableList = this.wvs.getSelectableEmployeeNames();

    const lastSelected = selectedList[selectedList.length - 1];
    const i = selectableList.indexOf(lastSelected);
    if (i === -1) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    const nextName = selectableList[i + 1];
    if ( !nextName ) {
      // tslint:disable-next-line:no-debugger
      debugger;
      return;
    }

    this.wvs.addSelectedEmployeeName(nextName);
  }

  private renoveLastEmployee() {
    const selectedList = this.wvs.getSelectedEmployeeNames();

    const lastSelected = selectedList[selectedList.length - 1];
    this.wvs.removeSelectedEmployeeName(lastSelected);
  }

  private printPublicDpoData() {
    console.log('_____________________________');
    console.log('_____printPublicDpoData______');
    console.log('_____________________________');
    console.log('getEmployees');
    console.log(this.dbi.dpo.getEmployees());
    console.log('_____________________________');
    console.log('getUsersEmployeeAccesses');
    console.log(this.dbi.dpo.getUsersEmployeeAccesses());
    console.log('_____________________________');
    console.log('getProjectList');
    console.log(this.dbi.dpo.getProjectList());
    console.log('_____________________________');
    console.log('_____________________________');
  }
}
