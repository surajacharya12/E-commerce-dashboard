"use client"

import * as React from "react"
import { ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export function MultiSelect({
    options = [],
    selected = [],
    onSelect,
    placeholder = "Select...",
}) {
    const [open, setOpen] = React.useState(false)

    // Toggle selection for an option
    const handleSelect = (value) => {
        const isSelected = selected.includes(value)
        if (isSelected) {
            onSelect(selected.filter((item) => item !== value))
        } else {
            onSelect([...selected, value])
        }
    }

    // Clear all selections — no need for stopPropagation
    const handleClear = () => {
        onSelect([])
    }

    // Get labels for all selected values
    const selectedLabels = selected
        .map((value) => options.find((option) => option.value === value)?.label)
        .filter(Boolean)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selected.length === 0 ? (
                        placeholder
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {selectedLabels.map((label) => (
                                <Badge key={label} variant="secondary" className="mr-1">
                                    {label}
                                </Badge>
                            ))}
                        </div>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                    className="cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(option.value)}
                                        readOnly
                                        className="mr-2"
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>


                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
