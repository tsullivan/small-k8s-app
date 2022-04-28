/*
 * This program was written by Tim Sullivan
 */

import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { QuestionFormat } from '../types';

interface FormTemplates {
  askName: HTMLTemplateElement | null;
  cardItem: HTMLTemplateElement | null;
  hello: HTMLTemplateElement | null;
  finish: HTMLTemplateElement | null;
  saveButton: HTMLTemplateElement | null;
  scorecard: HTMLTemplateElement | null;
}

export class FormDriver {
  private cardsBody: Element;
  private templates: FormTemplates;

  constructor() {
    const cardsBody = document.querySelector('.cards');
    if (!cardsBody) {
      throw new Error('Page error! cards container not found');
    }
    this.cardsBody = cardsBody;
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
    this.cardsBody.innerHTML = '';
  }

  public askName(): Observable<string> | void {
    const clone = this.templates?.askName?.content.cloneNode(true) as ParentNode | null;
    if (!clone) {
      return;
    }
    const [answer, submit] = Array.from(clone.querySelectorAll('input'));
    this.cardsBody.appendChild(clone);

    return fromEvent(submit, 'click').pipe(
      map((ev) => {
        ev.preventDefault();
        const name = answer.value || 'unknown';
        return name;
      })
    );
  }

  public addHello(name: string, startTime: Date): void {
    const clone = this.getTemplate('hello');
    const p = clone.querySelectorAll('p');
    p[0].innerText = `Hello, ${name}!`;
    p[1].innerText = `You started at ${startTime}`; // FIXME format the time
    this.cardsBody.append(clone);
  }

  public showQuestions(questions: Array<QuestionFormat>) {
    const size = questions.length;

    for (let i = 0; i < size; i++) {
      const clone = this.getTemplate('cardItem');
      const question = clone.querySelector('span.question');
      if (!question) {
        return;
      }
      const [newFirst, operator, last] = questions[i];
      question.textContent = `${newFirst} ${operator} ${last}`;
      this.cardsBody.appendChild(clone);
    }
  }

  public getGuesses(): Observable<number[]> | void {
    const clone = this.getTemplate('saveButton');
    const submit = clone.querySelector('#saveButton');
    if (!submit) {
      return;
    }
    this.cardsBody.append(clone);
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

  public addFinish(name: string, endTime: Date) {
    const clone = this.getTemplate('finish');
    const p = clone.querySelectorAll('p');
    p[0].innerText = `Hello, ${name}!`;
    p[1].innerText = `You finished at ${endTime}`; // FIXME format the time
    this.cardsBody.append(clone);
  }

  private getTemplate(template: keyof typeof this.templates): ParentNode {
    const clone = this.templates[template]?.content.cloneNode(true) as ParentNode | null;
    if (!clone) {
      throw new Error(`invalid template: ${template}`);
    }
    return clone;
  }

  public addScorecard() {
    const clone = this.getTemplate('scorecard');
    this.cardsBody.append(clone);
  }
}
