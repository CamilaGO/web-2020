import { fork, all } from 'redux-saga/effects';

import { watchLoginStarted } from './auth';
import { watchSayHappyBirthday } from './happyBirthday';

import {
  watchFetchOwners,
  watchAddOwner,
  watchRemoveOwner
} from './petOwners';


function* mainSaga() {
  yield all([
    fork(watchLoginStarted),
    fork(watchSayHappyBirthday),
    fork(watchFetchOwners),
    fork(watchAddOwner),
    fork(watchRemoveOwner),    
  ]);
}


export default mainSaga;
