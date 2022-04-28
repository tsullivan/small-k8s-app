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
  {
    const postResponse = await axios.post<LearnerSessionData>('/post', {
      name: state.name,
      questions: [],
    });
    console.log({ postResponse: postResponse.data });

    // Say hello
    form.clear();
    form.addHello(state.name, state.startTime);

    // Make some questions
    if (!postResponse.data.questions) {
      throw new Error('Could not get questions!');
    }
    state.questions = postResponse.data.questions;
  }

  form.showQuestions(state.questions);

  // Let them save
  const gameGuesses$ = form.getGuesses();
  if (!gameGuesses$) {
    throw new Error('Unrecoverable error');
  }
  state.guesses = await firstValueFrom(gameGuesses$);
  state.end();
  console.log(state.guesses);

  // Clear the screen
  form.clear();
  form.addFinish(state.name, state.endTime);

  const submitResponse = await axios.post<LearnerSessionData>('/submit', {
    guesses: state.guesses,
  });
  console.log({ submitResponse: submitResponse.data });


  // Show their guesses and the answers
  // Show a scorecard with their name
  form.addScorecard();
}
