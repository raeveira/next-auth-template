
/*
* Interface for the message type.
* */
export interface messageType {
    message: string;
    type: 'success' | 'error' | '';
}

/*
* Interface for the message component props.
* */
export interface MessageProps {
  message: string;
  type: 'success' | 'error' | '';
  onCloseAction: () => void;
}