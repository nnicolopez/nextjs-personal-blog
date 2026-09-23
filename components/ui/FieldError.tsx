import ui from "./ui.module.css";

const FieldError = ({ message }: { message?: string }) =>
  message ? <p className={ui.fieldError} role="alert">{message}</p> : null;

export default FieldError;
