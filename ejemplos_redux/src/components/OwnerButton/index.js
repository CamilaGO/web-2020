import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';

import './styles.css';
import * as selectors from '../../reducers';
import * as actions from '../../actions/petOwners';


const OwnerButton = ({ onClick, isHidden = false, onDelete, onCreate }) => {
    const [id, changeId] = useState('');
    const [name, changeName] = useState('');
    return (
        <Fragment>
            {
                !isHidden && (
                <div className='ownerForm'>
                    <p>
                        Owner Manage
                    </p>
                    <input 
                        className='inputOwner'
                        type="text"
                        placeholder="  ID para borrar"
                        value={id}
                        onChange={e => changeId(e.target.value)}
                    />
                    <button className='owner-button' onClick={() => onDelete(id)}>
                        {'Eliminar'}
                    </button>
                    <input
                        className='inputOwner'
                        type="text"
                        placeholder="  Nombre para agregar"
                        value={name}
                        onChange={e => changeName(e.target.value)}
                    />
                    <button className='owner-button' onClick={() => onCreate(name)}>
                        {'Crear'}
                    </button>
                    <button className='all-owners' onClick={onClick}>
                        {'All Owners'}
                    </button>
                </div>
                )
            }   
        </Fragment>
    );
}


export default connect(
  state => ({
    isHidden: !selectors.isAuthenticated(state),
  }),
  dispatch => ({
    onClick() {
      dispatch(actions.startFetchingPetOwners());
    },
    onCreate(name) {
        dispatch(actions.startAddingPetOwner(name));
    },
    onDelete(id) {
        dispatch(actions.startRemovingPetOwner(id));
    },
  })
)(OwnerButton);