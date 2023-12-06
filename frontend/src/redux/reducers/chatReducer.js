import {
  SET_CHATROOMS,
  SET_SOCKET,
  RECEIVED_MESSAGE,
  REMOVE_CHATROOM,
} from "../constants/chatConstants";

export const initialChatRooms = {
  socket: false,
  messageReceived: false,
  chatRooms: {},
};

const chatReducer = (state = initialChatRooms, action) => {
  switch (action.type) {
    case SET_CHATROOMS: {
      let currentState = { ...state };

      if (currentState.chatRooms[action.payload.user]) {
        currentState.chatRooms[action.payload.user].push({
          client: action.payload.message,
        });
      } else {
        currentState.chatRooms[action.payload.user] = [
          {
            client: action.payload.message,
          },
        ];
      }

      return {
        ...state,
        chatRooms: { ...currentState.chatRooms },
      };
    }
    case SET_SOCKET: {
      return {
        ...state,
        socket: action.payload.socket,
      };
    }
    case RECEIVED_MESSAGE: {
      return {
        ...state,
        messageReceived: action.payload.value,
      };
    }
    case REMOVE_CHATROOM: {
      const curChatRooms = { ...state };
      delete curChatRooms.chatRooms[action.payload.socketId];
      return {
        ...state,
        chatRooms: { ...curChatRooms.chatRooms },
      };
    }
    default: {
      return state;
    }
  }
};

export default chatReducer;
