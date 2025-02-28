import { Label } from "../Atoms/Label/Label";

interface InputContainerProps {
  children: React.ReactNode;
  labelText: string;
  labelName: string;
}

export const InputContainer = ({
  children,
  labelName,
  labelText,
}: InputContainerProps) => {
  return (
    <div className="input-container">
      <Label name={labelName} text={labelText} />

      {children}
    </div>
  );
};
