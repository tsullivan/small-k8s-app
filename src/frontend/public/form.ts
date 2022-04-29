/*
 * This program was written by Tim Sullivan
 */

import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { LearnerSessionData, QuestionFormat } from '../types';

interface FormTemplates {
  askName: HTMLTemplateElement | null;
  cardItem: HTMLTemplateElement | null;
  hello: HTMLTemplateElement | null;
  finish: HTMLTemplateElement | null;
  saveButton: HTMLTemplateElement | null;
  scorecard: HTMLTemplateElement | null;
}

export class FormDriver {
  private appBody: Element;
  private helloBody: Element;
  private scorecardBody: Element;
  private templates: FormTemplates;

  constructor() {
    const appBody = document.querySelector('.app');
    const helloBody = document.querySelector('.app-hello');
    const scorecardBody = document.querySelector('.app-scorecard');
    if (!appBody || !helloBody || !scorecardBody) {
      throw new Error('Page error! App container not found');
    }
    this.appBody = appBody;
    this.helloBody = helloBody;
    this.scorecardBody = scorecardBody;
    this.templates = {
      askName: document.querySelector('#askNameTemplate'),
      cardItem: document.querySelector('#cardItemTemplate'),
      hello: document.querySelector('#helloTemplate'),
      finish: document.querySelector('#finishTemplate'),
      saveButton: document.querySelector('#saveTemplate'),
      scorecard: document.querySelector('#scorecardTemplate'),
    };
  }

  public clear() {
    this.appBody.innerHTML = '';
  }

  private getTemplate(template: keyof typeof this.templates): ParentNode {
    const clone = this.templates[template]?.content.cloneNode(
      true
    ) as ParentNode | null;
    if (!clone) {
      throw new Error(`invalid template: ${template}`);
    }
    return clone;
  }

  public askName(): Observable<string> | void {
    const clone = this.getTemplate('askName');
    const [answer, submit] = Array.from(clone.querySelectorAll('input'));
    this.appBody.appendChild(clone);

    return fromEvent(submit, 'click').pipe(
      map((ev) => {
        ev.preventDefault();
        const name = answer.value || 'unknown';
        return name;
      })
    );
  }

  public addHello(name: string, startTime: Date) {
    const clone = this.getTemplate('hello');
    const p = clone.querySelectorAll('p');
    p[0].innerText = `Hello, ${name}!`;
    p[1].innerText = `You started at ${startTime}`; // FIXME format the time
    this.helloBody.append(clone);
  }

  public showQuestions(questions: Array<QuestionFormat>) {
    const size = questions.length;

    for (let i = 0; i < size; i++) {
      const clone = this.getTemplate('cardItem');
      const question = clone.querySelector('span.app-question');
      if (!question) {
        return;
      }
      const [newFirst, operator, last] = questions[i];
      question.textContent = `${newFirst} ${operator} ${last}`;
      this.appBody.appendChild(clone);
    }
  }

  public getGuesses(): Observable<number[]> | void {
    const clone = this.getTemplate('saveButton');
    const submit = clone.querySelector('#saveButton');
    if (!submit) {
      return;
    }
    this.appBody.append(clone);
    return fromEvent(submit, 'click').pipe(
      map((ev) => {
        ev.preventDefault();
        const answers = Array.from(document.querySelectorAll('input')).map((i) =>
          parseInt(i.value, 10)
        );
        // return all the answers that have been entered
        return answers;
      })
    );
  }

  public addFinish(data: LearnerSessionData) {
    const clone = this.getTemplate('finish');
    const p = clone.querySelectorAll('p');
    p[0].innerText = `You finished in ${data.time}ms`; // FIXME format the time
    p[1].innerText = `Your grade: ${data.grade}`;

    this.helloBody.innerHTML = '';
    this.appBody.append(clone);
  }

  public addScorecard(data: LearnerSessionData) {
    const clone = this.getTemplate('scorecard');
    const scoreTable = clone.querySelector('tbody');

    if (!data.questions || !data.answers || !data.guesses) {
      throw new Error('Invalid session!');
    }

    for (let i = 0; i < data.questions.length; i++) {
      const tableRow = document.createElement('tr');
      tableRow.className = 'cucunano__cellRow';

      const [cellQuestion, cellGuess, cellCorrect] = [
        document.createElement('td'),
        document.createElement('td'),
        document.createElement('td'),
      ];

      cellQuestion.className = 'cucunano__cell';
      cellGuess.className = 'cucunano__cell';
      cellCorrect.className = 'cucunano__cell';

      const [newFirst, operator, last] = data.questions[i];
      const guess = data.guesses[i];
      cellQuestion.textContent = `${newFirst} ${operator} ${last}`;
      cellGuess.textContent = guess?.toString() || '-';
      cellCorrect.textContent =
        data.answers[i] === data.guesses[i] ? 'Yes: 🙌' : `No: ${data.answers[i]} 😿`;

      tableRow?.appendChild(cellQuestion);
      tableRow?.appendChild(cellGuess);
      tableRow?.appendChild(cellCorrect);
      scoreTable?.appendChild(tableRow);
    }

    this.scorecardBody.append(clone);
  }
}
