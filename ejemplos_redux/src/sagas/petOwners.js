import {
    call,
    takeEvery,
    put,
    // race,
    // all,
    delay,
    select,
  } from 'redux-saga/effects';
  
import * as selectors from '../reducers';
import * as actions from '../actions/petOwners';
import * as types from '../types/petOwners';
import { v4 as uuidv4 } from 'uuid';
  
  
const API_BASE_URL = 'http://localhost:8000/api/v1';
  
  
function* fetchOwners(action) {
    try {

        const isAuthenticated = yield select(selectors.isAuthenticated);
        if(isAuthenticated) {
            const token = yield select(selectors.getAuthToken);

            const response = yield call(
                fetch,
                `${API_BASE_URL}/owner/`,
                    {
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`
                    },
                }
            );
    
            if (response.status === 200) {
                let entities = {}
                let order = []
    
                const data = yield response.json();
                
                data.map(owner => {
                    const id = uuidv4()
                    entities = {
                        ...entities, 
                        [id]: owner,
                    }
                    order = [
                        ...order, 
                        id
                    ]
                });

                console.log('Owners: ', data)
                console.log('Fetchado')
                yield put(actions.completeFetchingPetOwners(entities, order));
    
            } else {
                //throw "Bad request from server...";
                const { non_field_errors } = yield response.json();
                console.log('NO Fetchado')
                yield put(actions.failFetchingPetOwners(non_field_errors[0]));
            }
        } /*else {
            throw "You are not authenticated...";
        }*/
    } catch (error) {
        /* console.log(error)
        yield put(actions.failFetchingPetOwners(error.message ? error.message : 'Something went wrong...'));*/
        console.log('Cagadales')
        yield put(actions.failFetchingPetOwners('Falló horrible la conexión mano'));
    }
}

function* addOwner(action) {
    try {
        const isAuthenticated = yield select(selectors.isAuthenticated);
        if (isAuthenticated) {
            const token = yield select(selectors.getAuthToken);
            const owner_data  = action.payload;
            const response = yield call(
                fetch,
                `${API_BASE_URL}/owner/`,
                    {
                    method: 'POST',
                    body: JSON.stringify({ name: owner_data}),
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
            let id = uuidv4();
            if (response.status === 201) {
                const owner_added = yield response.json();
                console.log("Owner agregado exitosamente: ", owner_added);
                yield put(actions.completeAddingPetOwner(id, owner_added));
            } else {
                //throw "Bad request from server...";
                const { non_field_errors } = yield response.json();
                yield put(actions.failAddingPetOwner(id, non_field_errors[0]));
            }
        } /* else {
            throw "You are not authenticated...";
        } */
    } catch (error) {
        console.log(error)
        yield put(actions.failAddingPetOwner('Falló horrible la conexión mano'));
    }
}

function* removeOwner(action) {   
    //There's no poblem to destrucute action here...
    const { id } = action.payload;
    
    try {
        const isAuthenticated = yield select(selectors.isAuthenticated);

        if (isAuthenticated) {
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}/owner/${id}`,
                    {
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `JWT ${token}`,
                    },
                }
            );
            if (response.status === 200) {
                yield put(actions.completeRemovingPetOwner());
                console.log('Onwer eliminado con id: ', id)
            } else {
                const { non_field_errors } = yield response.json();
                yield put(actions.failRemovingPetOwner(actions.payload.id, non_field_errors[0]));
                //throw "Bad request from server...";
            }
        } /*else {
            throw "You are not authenticated...";
        }*/
    } catch (error) {
        console.log(error)
        yield put(actions.failRemovingPetOwner('Falló horrible la conexión mano'));
    }
}

  
export function* watchFetchOwners() {
    yield takeEvery(
      types.PET_OWNERS_FETCH_STARTED,
      fetchOwners,
    );
}

export function* watchAddOwner() {
    yield takeEvery(
        types.PET_OWNER_ADD_STARTED,
        addOwner,
    );
}

export function* watchRemoveOwner() {
    yield takeEvery(
        types.PET_OWNER_REMOVE_STARTED,
        removeOwner,
    );
}
  