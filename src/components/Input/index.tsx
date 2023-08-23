const Input = ({
  onChange,
  value
}: {
  value: string
  onChange: (value: string) => void;
}) => {
  return (
    <input value={value} onChange={(ev) => onChange(ev.target.value)} className="min-w-[430px] font-thin pb-2 border-b-2 bg-transparent focus:outline-none border-charcoal-600" placeholder="Add todo item"></input>
  )
}

export default Input;