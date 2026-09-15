import type { CatalogCategory } from '../../content/content'

type CategoryFilterProps = {
  value: string
  onChange: (category: CatalogCategory | '') => void
  label: string
  placeholder: string
  categories: readonly CatalogCategory[]
}

function CategoryFilter({
  value,
  onChange,
  label,
  placeholder,
  categories,
}: CategoryFilterProps) {
  return (
    <select
      className="category-select"
      value={value}
      aria-label={label}
      onChange={(e) => onChange(e.target.value as CatalogCategory | '')}
    >
      <option value="">{placeholder}</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {category}
        </option>
      ))}
    </select>
  )
}

export default CategoryFilter