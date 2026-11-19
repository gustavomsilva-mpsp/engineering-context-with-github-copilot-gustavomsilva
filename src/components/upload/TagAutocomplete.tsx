"use client";

import { useId, useState } from "react";

type TagAutocompleteProps = {
  availableTags: readonly string[];
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function TagAutocomplete({
  availableTags,
  label,
  value,
  onChange,
}: TagAutocompleteProps) {
  const listboxId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const separatorIndex = value.lastIndexOf(",");
  const query = value.slice(separatorIndex + 1).trim().toLowerCase();
  const selectedTags = (separatorIndex >= 0 ? value.slice(0, separatorIndex) : "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
  const suggestions = query
    ? availableTags.filter(
        (tag) =>
          tag.toLowerCase().startsWith(query) &&
          !selectedTags.includes(tag.toLowerCase()),
      )
    : [];
  const showSuggestions = isOpen && suggestions.length > 0;

  function selectTag(tag: string) {
    const prefix = separatorIndex >= 0
      ? value.slice(0, separatorIndex).trim()
      : "";
    onChange(`${prefix}${prefix ? ", " : ""}${tag}`);
    setIsOpen(false);
  }

  return (
    <div className="tag-autocomplete">
      <input
        aria-autocomplete="list"
        aria-controls={showSuggestions ? listboxId : undefined}
        aria-expanded={showSuggestions}
        aria-label={label}
        autoComplete="off"
        name="tags"
        onBlur={() => setIsOpen(false)}
        onChange={(event) => {
          onChange(event.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="wedding, portrait, outdoor..."
        role="combobox"
        type="text"
        value={value}
      />
      {showSuggestions ? (
        <ul className="tag-suggestions" id={listboxId} role="listbox">
          {suggestions.map((tag) => (
            <li
              aria-selected="false"
              key={tag}
              onClick={() => selectTag(tag)}
              onMouseDown={(event) => event.preventDefault()}
              role="option"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}