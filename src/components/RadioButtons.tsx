type Props = {
  text: string
  setting: string
  labels: number[]
  value: number
  handleValue: (value: number) => void
}

export const RadioButtons = ({
  text,
  setting,
  labels,
  value,
  handleValue,
}: Props) => {
  return (
    <form className="flex justify-center">
      <div className="mr-3">{text}</div>
      {labels.map((label) => (
        <RadioButton
          name={setting}
          label={label}
          handleValue={handleValue}
          key={label}
          checked={label === value}
        />
      ))}
    </form>
  )
}

type RadioButtonProps = {
  name: string
  label: number
  handleValue: (value: number) => void
  checked: boolean
}

const RadioButton = ({
  name,
  label,
  handleValue,
  checked,
}: RadioButtonProps) => {
  return (
    <div className="flex mr-3">
      <input
        type="radio"
        onChange={() => handleValue(label)}
        name={name}
        value={label}
        className="mr-1"
        checked={checked}
      />
      <div>{label}</div>
    </div>
  )
}
