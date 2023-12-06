import {
  SET_CHATROOMS,
  SET_SOCKET,
  RECEIVED_MESSAGE,
  REMOVE_CHATROOM,
} from "../constants/chatConstants";

export const setChatRooms = (user, message) => async (dispatch) => {
  dispatch({
    type: SET_CHATROOMS,
    payload: {
      user,
      message,
    },
  });
};

export const setSocket = (socket) => async (dispatch) => {
  dispatch({
    type: SET_SOCKET,
    payload: {
      socket,
    },
  });
};

export const receivedMessage = (value) => async (dispatch) => {
  dispatch({
    type: RECEIVED_MESSAGE,
    payload: {
      value,
    },
  });
};

export const removeChatRoom = (socketId) => async (dispatch) => {
  dispatch({
    type: SET_SOCKET,
    payload: {
      socketId,
    },
  });
};
