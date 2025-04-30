import { createStore } from 'redux';


const SET_CURRENT_VIDEO = 'SET_CURRENT_VIDEO';


export const setCurrentVideo = (index) => ({
  type: SET_CURRENT_VIDEO,
  payload: index,
});


const initialState = {
  currentVideoIndex: 0,
};


const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_VIDEO:
      return {
        ...state,
        currentVideoIndex: action.payload,
      };
    default:
      return state;
  }
};


export const store = createStore(videoReducer);
