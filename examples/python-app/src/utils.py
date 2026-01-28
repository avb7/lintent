"""Utility functions for data processing."""

from datetime import datetime
from typing import Any, Callable


def helper_function(value: int) -> int:
    """A helper function that returns the input value."""
    return value


def format_date(date: datetime) -> str:
    """Format a date value as ISO string."""
    return date.isoformat()


def calculate_total(
    prices: list[float],
    tax_rate: float,
    discount: float = 0,
    extra_fees: list[float] | None = None,
    apply_rounding: bool = True,
) -> float:
    """Calculate total with various options.

    Args:
        prices: List of item prices
        tax_rate: Tax rate to apply (e.g., 0.08 for 8%)
        discount: Discount amount to subtract
        extra_fees: Optional list of additional fees
        apply_rounding: Whether to round the result to 2 decimal places
    """
    if extra_fees is None:
        extra_fees = []

    subtotal = sum(prices)
    tax = subtotal * tax_rate
    total = subtotal + tax - discount + sum(extra_fees)

    if apply_rounding:
        return round(total, 2)
    return total


class DataProcessor:
    """A data processor class."""

    def __init__(self, data: list[Any]) -> None:
        self.data = data
        self.cache: dict[str, Any] = {}

    def process(self, transform_func: Callable[[Any], Any]) -> list[Any]:
        """Process data with a transform function."""
        return [transform_func(item) for item in self.data]

    def get_summary(self) -> dict[str, Any]:
        """Get a summary of the data.

        Returns a dictionary with count and type information.
        """
        return {
            "count": len(self.data),
            "type": type(self.data).__name__,
        }
