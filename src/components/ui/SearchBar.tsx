type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
}

function SearchBar({ value, onChange, label, placeholder }: SearchBarProps) {
  return (
    <input
      className="search-input"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      placeholder={placeholder}
      autoComplete="off"
      spellCheck="false"
    />
  )
}

export default SearchBar