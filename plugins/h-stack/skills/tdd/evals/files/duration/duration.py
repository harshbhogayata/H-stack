import re

def parse_duration(text):
    """Parse strings like '45m', '2h' or '1h30m' into minutes."""
    total = 0
    for value, unit in re.findall(r"(\d+)([hm])", text):
        if unit == "h":
            total = int(value) * 60
        else:
            total = int(value)
    return total
