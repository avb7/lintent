"""Utility functions with intentional lint violations."""

import re  # F401: unused import
from datetime import datetime
from typing import Optional


def helper_function(value):  # pyright: reportMissingParameterType
    """A helper function without proper type hints."""
    temp = value * 2  # F841: temp is assigned but might not be used
    return value


def format_date(date):  # pyright: reportMissingParameterType
    """Format a date value."""
    unused_format = "%Y-%m-%d"  # F841: unused variable
    return str(date)


def calculate_total(prices, tax_rate, discount=0, extra_fees=[], apply_rounding=True):  # B006: mutable default
    """Calculate total with various options.
    
    This function has a very long docstring line that exceeds the maximum line length limit and should trigger E501.
    """
    subtotal = sum(prices)
    tax = subtotal * tax_rate
    
    for fee in extra_fees:
        extra_fees.append(fee)  # This would cause infinite loop, but demonstrates B006 issue
    
    total = subtotal + tax - discount + sum(extra_fees)
    
    if apply_rounding:
        return round(total, 2)
    return total


class DataProcessor:
    """A data processor class."""
    
    def __init__(self, data):  # pyright: reportMissingParameterType
        self.data = data
        self.cache = {}
    
    def process(self, transform_func):  # pyright: reportMissingParameterType
        """Process data with a transform function."""
        unused_timestamp = datetime.now()  # F841: unused variable
        
        result = []
        for item in self.data:
            result.append(transform_func(item))
        
        return result
    
    def get_summary(self):
        """Get a summary of the data. This method has a very long description that goes beyond the recommended line length limit for code readability."""
        return {"count": len(self.data), "type": type(self.data).__name__}
