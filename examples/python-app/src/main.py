"""Main module with intentional lint violations for lintent testing."""

import os  # F401: unused import
import sys
import json
from typing import List, Dict, Any

from .utils import helper_function


def process_data(items):  # pyright: reportMissingParameterType - missing type annotation
    """Process a list of items."""
    result = []
    unused_var = 42  # F841: assigned but never used
    
    for item in items:
        # E501: line too long - this line is intentionally very long to trigger the line length violation for testing purposes
        result.append({"id": item["id"], "name": item["name"], "description": item["description"], "category": item["category"], "price": item["price"], "metadata": item["metadata"]})
    
    return result


def get_default_config(options=[]):  # B006: mutable default argument
    """Get default configuration."""
    options.append("default")
    return {
        "debug": True,
        "options": options,
    }


def complex_function(data, flag, mode, extra=None):  # C901: too complex (intentionally)
    """A function that is too complex."""
    result = []
    
    if flag:
        if mode == "a":
            if data:
                for item in data:
                    if item > 0:
                        if extra:
                            result.append(item * 2 + extra)
                        else:
                            result.append(item * 2)
                    else:
                        if extra:
                            result.append(item - extra)
                        else:
                            result.append(item)
            else:
                result = [0]
        elif mode == "b":
            if data:
                result = [x for x in data if x > 0]
            else:
                result = []
        else:
            result = data or []
    else:
        if mode == "a":
            result = []
        elif mode == "b":
            result = [1, 2, 3]
        else:
            result = None
    
    return result


def main():
    """Main entry point."""
    print("Running example app...")
    
    # Some sample data
    items = [
        {"id": 1, "name": "Item 1", "description": "First item", "category": "A", "price": 10.99, "metadata": {}},
        {"id": 2, "name": "Item 2", "description": "Second item", "category": "B", "price": 20.99, "metadata": {}},
    ]
    
    processed = process_data(items)
    config = get_default_config()
    
    print(f"Processed {len(processed)} items")
    print(f"Config: {config}")


if __name__ == "__main__":
    main()
