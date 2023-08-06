import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication, DomSanitizer } from '@angular/platform-browser';
import { NgxMentionsModule, ChoiceWithIndices } from 'ngx-mentions';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
}

interface Tag {
  id: string;
  tag: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  loading = false;
  choices: (User | Tag)[] = [];
  mentions: ChoiceWithIndices[] = [];
  customTagStyle = new FormControl(true);

  mentionsConfig = [
    {
      triggerCharacter: '@',
      getChoiceLabel: (item: User): string => {
        return `${item.name}`;
      },
    },
  ];

  selectedChoices: ChoiceWithIndices[] = [
    {
      choice: {
        id: '1001',
        name: 'Amelia',
      },
      indices: {
        start: 0,
        end: 7,
        triggerCharacter: '@',
      },
      cssClass: 'hash-highlight-tag',
    },
  ];
  searchRegexp = new RegExp('^([-&.\\w]+ *){0,3}$');
  formattedText!: string;
  textCtrl: FormControl = new FormControl(
    ''
  );
  constructor(private sanitizer: DomSanitizer) { }
  parentCommentStatusBasedStyles = {
    bgColor: '#FFFF00',
    color: '#FFFF00',
    bdColor: '#FFFF00',
  };
  ngOnInit() {
    this.customTagStyle.valueChanges.subscribe((value: any) => {
      this.mentions = this.mentions.map((choice) => ({
        ...choice,
      }));
    });
  }

  async loadChoices({
    searchText,
    triggerCharacter,
  }: {
    searchText: string;
    triggerCharacter: string;
  }): Promise<(User | Tag)[]> {
    let searchResults;
    if (triggerCharacter === '@') {
      searchResults = await this.getUsers();
      this.choices = searchResults.filter((user) => {
        // const alreadyExists = this.mentions.some((m) => m.choice.name === user.name);
        return user.name.toLowerCase().indexOf(searchText.toLowerCase()) > -1;
        // && !alreadyExists;
      });
    }
    return this.choices;
  }

  getChoiceLabel = (user: User): string => {
    return `@${user.name}`;
  };

  getDisplayLabel = (item: User | Tag): string => {
    if (item.hasOwnProperty('name')) {
      return (item as User).name;
    }
    return (item as Tag).tag;
  };

  onSelectedChoicesChange(choices: ChoiceWithIndices[]): void {
    console.log("choices",choices)
    if (this.customTagStyle.value) {
      this.mentions = choices.map((choice) => ({
        ...choice,
        cssClass: 'hash-highlight-tag',
      }));
    } else {
      this.mentions = choices;
    }
  }

  onMenuShow(): void {
    console.log('Menu show!');
  }

  onMenuHide(): void {
    console.log('Menu hide!');
    this.choices = [];
  }

  

  async getUsers(): Promise<User[]> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.loading = false;
        resolve([
          {
            id: 1,
            name: 'Gina Williams',
          },
          {
            id: 2,
            name: 'Jake Williams',
          },
          {
            id: 3,
            name: 'Jamie John',
          },
          {
            id: 4,
            name: 'John Doe',
          },
          {
            id: 5,
            name: 'Jeff Stewart',
          },
          {
            id: 6,
            name: 'Paula M. Keith',
          },
        ]);
      }, 600);
    });
  }

}
