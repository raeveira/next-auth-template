export interface messageType {
    message: string;
    type: 'success' | 'error' | '';
}

export interface MessageProps {
  message: string;
  type: 'success' | 'error' | '';
  onCloseAction: () => void;
}