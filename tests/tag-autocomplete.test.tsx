import { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { TagAutocomplete } from "@/components/upload/TagAutocomplete";

const LOCAL_TAGS = ["portrait", "wedding", "wildlife"];

function ControlledTagAutocomplete() {
  const [value, setValue] = useState("");
  return (
    <TagAutocomplete
      availableTags={LOCAL_TAGS}
      label="Tags"
      value={value}
      onChange={setValue}
    />
  );
}

describe("TagAutocomplete", () => {
  it("encontra a sugestão com busca em maiúsculas e preserva as tags anteriores", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);
    const input = screen.getByRole("combobox", { name: "Tags" });

    await user.type(input, "portrait, WI");
    await user.click(screen.getByRole("option", { name: "wildlife" }));

    expect(input).toHaveValue("portrait, wildlife");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("remove as sugestões antigas quando a busca não tem correspondência", async () => {
    const user = userEvent.setup();
    render(<ControlledTagAutocomplete />);
    const input = screen.getByRole("combobox", { name: "Tags" });

    await user.type(input, "w");
    expect(screen.getByRole("option", { name: "wedding" })).toBeInTheDocument();

    await user.type(input, "zzz");

    expect(input).toHaveValue("wzzz");
    expect(screen.queryByRole("option")).not.toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
