/*
 * This program was written by Tim Sullivan
 */

import { firstValueFrom } from 'rxjs';
import { FormDriver } from './form';
import { GameState } from './state';
import axios from 'axios';
import { LearnerSessionData } from '../types';

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
    throw new Error('Unrecoverable error');
  }
  state.name = await firstValueFrom(name$);

  // sync the name to the server, retrieve the set of questions
  const { data: postResponse } = await axios.post<LearnerSessionData>('/post', {
    name: state.name,
    questions: [],
  });
  if (!postResponse.name || !postResponse.startTime || !postResponse.questions) {
    throw new Error('Invalid post response!');
  }

  // Say hello
  form.clear();
  form.addHello(state.name, postResponse.startTime);

  // Display questions
  form.showQuestions(postResponse.questions);

  // Let them save
  const gameGuesses$ = form.getGuesses();
  if (!gameGuesses$) {
    throw new Error('Unrecoverable error');
  }
  const guesses = await firstValueFrom(gameGuesses$);

  // Clear the screen
  form.clear();

  const { data: submitResponse } = await axios.post<LearnerSessionData>('/submit', {
    guesses,
  });

  if (!submitResponse.time) {
    throw new Error('Invalid post response!');
  }

  // Show their time and grade
  form.addFinish(submitResponse);

  // Show their guesses and the answers
  form.addScorecard(submitResponse);
}
