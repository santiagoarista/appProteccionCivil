import { TextInput } from "react-admin";
import { InputProps } from "react-admin";

interface TimeInputProps extends Omit<InputProps, "type"> {
  source: string;
  label?: string;
  fullWidth?: boolean;
}

const TimeInput = ({ source, label, fullWidth, ...rest }: TimeInputProps) => {
  return (
    <TextInput
      source={source}
      label={label}
      fullWidth={fullWidth}
      type="time"
      {...rest}
    />
  );
};

export default TimeInput;
