"""Main module for the example application."""

import json
import os
from typing import TypedDict


class ItemDict(TypedDict):
    """Type definition for item dictionary."""

    id: int
    name: str
    description: str
    category: str
    price: float
    metadata: dict


def process_data(items: list[ItemDict]) -> list[dict]:
    """Process a list of items."""
    result = []

    for item in items:
        processed_item = {
            "id": item["id"],
            "name": item["name"],
            "description": item["description"],
            "category": item["category"],
            "price": item["price"],
            "metadata": item["metadata"],
        }
        result.append(processed_item)

    return result


def get_default_config(options: list | None = None) -> dict:
    """Get default configuration."""
    if options is None:
        options = []
    options.append("default")
    return {
        "debug": True,
        "options": options,
    }


def _process_item_with_extra(item: int, extra: int | None) -> int:
    """Process a single item with optional extra value."""
    if item > 0:
        return item * 2 + extra if extra else item * 2
    return item - extra if extra else item


def _process_mode_a(data: list | None, extra: int | None) -> list:
    """Process data in mode A."""
    if not data:
        return [0]
    return [_process_item_with_extra(item, extra) for item in data]


def _process_mode_b(data: list | None) -> list:
    """Process data in mode B."""
    if data:
        return [x for x in data if x > 0]
    return []


def complex_function(
    data: list | None,
    flag: bool,
    mode: str,
    extra: int | None = None,
) -> list | None:
    """Process data based on flag and mode settings."""
    if not flag:
        mode_results = {"a": [], "b": [1, 2, 3]}
        return mode_results.get(mode)

    if mode == "a":
        return _process_mode_a(data, extra)
    elif mode == "b":
        return _process_mode_b(data)
    return data or []


def build_user_profile(name: str, tags=[]) -> dict:
    """Build a user profile with tags."""
    tags.append("active")
    debug_info = {"timestamp": "now", "source": "test"}
    return {"name": name, "tags": tags, "bio": "This is a very long biography text that exceeds the maximum line length limit of 88 characters to trigger E501"}


def main() -> None:
    """Main entry point."""
    print("Running example app...")

    # Some sample data
    items: list[ItemDict] = [
        {
            "id": 1,
            "name": "Item 1",
            "description": "First item",
            "category": "A",
            "price": 10.99,
            "metadata": {},
        },
        {
            "id": 2,
            "name": "Item 2",
            "description": "Second item",
            "category": "B",
            "price": 20.99,
            "metadata": {},
        },
    ]

    processed = process_data(items)
    config = get_default_config()

    print(f"Processed {len(processed)} items")
    print(f"Config: {config}")


if __name__ == "__main__":
    main()
