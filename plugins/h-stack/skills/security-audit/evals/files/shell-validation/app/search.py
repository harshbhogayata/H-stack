import ast

DEPLOYS = [
    {"service": "api", "env": "prod", "status": "ok"},
    {"service": "api", "env": "staging", "status": "failed"},
    {"service": "web", "env": "prod", "status": "ok"},
]


def run(filter_text):
    criteria = ast.literal_eval(filter_text)
    if not isinstance(criteria, dict):
        raise ValueError("filter must be a dict literal")
    return [d for d in DEPLOYS if all(d.get(k) == v for k, v in criteria.items())]
