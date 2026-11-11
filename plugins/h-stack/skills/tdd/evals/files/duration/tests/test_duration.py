import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from duration import parse_duration

def test_minutes():
    assert parse_duration("45m") == 45

def test_hours():
    assert parse_duration("2h") == 120
