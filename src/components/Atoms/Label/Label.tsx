interface LabelProps {
  name: string;
  text: string;
}

export const Label = ({ name, text }: LabelProps) => {
  return <label htmlFor={name} className="label">{text}</label>;
};
