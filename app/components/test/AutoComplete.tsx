import { Autocomplete, AutocompleteItem } from "@heroui/react";
import React from "react";

const AutoComplete = ({ suggestions }: any) => {
  console.log(suggestions);
  return (
    <Autocomplete
      defaultItems={suggestions}
      label="Favorite Animal"
      placeholder="Search an animal"
      className="max-w-xs"
    >
      {suggestions.map((data: any) => (
        <AutocompleteItem key={data.key}>
          {data.value}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default AutoComplete;