import Select, { MultiValue } from 'react-select';

interface OptionType {
  value: string;
  label: string;
}

interface MultiSelectProps {
  onSelectChange: (selectedOptions: string[]) => void;
}

const options: OptionType[] = [
  { value: 'photo', label: 'Photo' },
  { value: 'editorial_summary', label: 'Editorial Summary' },
  { value: 'opening_hours', label: 'Opening Hours' },
  { value: 'price_level', label: 'Price Level' },
  { value: 'rating', label: 'Rating' },
];

const MultiSelect: React.FC<MultiSelectProps> = ({ onSelectChange }) => {
  const handleChange = (selectedOptions: MultiValue<OptionType>) => {
    // Extract the values from selected options
    const selectedValues = selectedOptions.map((opt) => opt.value);
    onSelectChange(selectedValues);
  };

  return <Select isMulti options={options} onChange={handleChange} />;
};

export default MultiSelect;
