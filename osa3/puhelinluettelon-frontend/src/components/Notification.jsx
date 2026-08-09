const classNames = [
  'notify-success',
  'notify-warning',
  'notify-error'
];

const toClassName = (type) => {
  const formatted = type.trim().toLowerCase();
  return `notify-${formatted}`
}

const Notification = ({ message, type }) => {
  if (typeof message !== "string") 
      return null;
  if (typeof type !== "string") 
      return null;

  const className = toClassName(type);
  if (!classNames.includes(className)) 
    return null;

  return <div className={className}>{message}</div>;
};

export default Notification