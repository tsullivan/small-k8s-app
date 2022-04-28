/*
 * This program was written by Tim Sullivan
 */

import { firstValueFrom } from 'rxjs';
import { FormDriver } from './form';
import { GameState } from './state';
import { getNewQuestions } from './get_questions';
import axios from 'axios';

if ('content' in document.createElement('template')) {
  document.addEventListener('DOMContentLoaded', main);
} else {
  window.alert('Sorry, this browser is not supported.');
}

async function main() {
  const form = new FormDriver();
  form.clear();

  const state = new GameState();

  // Ask their name
  const name$ = form.askName();
  if (!name$) {
    throw new Error('an unrecoverable error has occurred.');
  }
  state.name = await firstValueFrom(name$);

  // sync the name to the server, retrieve the set of questions
  const result = await axios.post('/post', {
    name: state.name,
    stage: null,
    questions: [],
  });
  console.log({ result });

  // Say hello
  form.clear();
  form.addHello(state.name, state.startTime);

  // Make some questions
  [state.gameAnswers, state.questions] = getNewQuestions(46);
  form.showNewQuestions(state.questions, 46);

  form.addSave();

  // Let them save
  //
  // Clear the screen
  //
  // Show their answers
  //
  // Let them save again (double check)
  //
  // Show a scorecard with their name

  // Remove saved data from sessionStorage
  //sessionStorage.removeItem('key');

  // Remove all saved data from sessionStorage
  //sessionStorage.clear();
}
