/*
 * This program was written by Tim Sullivan
 */

import { Observable, fromEvent } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { QuestionFormat } from '../types';

interface FormTemplates {
  askName: HTMLTemplateElement | null;
  cardItem: HTMLTemplateElement | null;
  hello: HTMLTemplateElement | null;
  save: HTMLTemplateElement | null;
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
      save: document.querySelector('#saveTemplate'),
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
    const [ answer, submit ] = Array.from(clone.querySelectorAll('input'));
    this.cardsBody.appendChild(clone);

    return fromEvent(submit, 'click').pipe(first(), map((ev) => {
      ev.preventDefault();
      const name = answer.value || 'unknown';
      return name;
    }));
  }

  public addHello( name: string, startTime: Date,): void {
    const clone = this.templates.hello?.content.cloneNode(true) as ParentNode | null;
    if (!clone) {
      return;
    }
    const p = clone.querySelectorAll('p');
    p[0].innerText = `Hello, ${name}!`;
    p[1].innerText = `You started at ${startTime}`;
    this.cardsBody.append(clone);
  }

  public showNewQuestions(questions: Array<QuestionFormat>, size: number) {
    for (let i = 0; i < size; i++) {
      const clone = this.templates.cardItem?.content.cloneNode(true) as ParentNode | null;
      if (!clone) {
        return;
      }
      const [ question ] = Array.from(clone.querySelectorAll('span.question'));
      const [ newFirst, operator, last ] = questions[i];
      question.textContent = `${newFirst} ${operator} ${last}`;
      this.cardsBody.appendChild(clone);
    }
  }

  public addSave() {
    const clone = this.templates.save?.content.cloneNode(true) as ParentNode | null;
    if (!clone) {
      return;
    }
    this.cardsBody.append(clone);
  }
}

