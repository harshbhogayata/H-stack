from . import reports, search, tasks


def handle(path, params, user):
    if not user:
        return 401, {"error": "sign in required"}
    try:
        if path == "/api/commit":
            return 200, {"stat": tasks.show_commit(params.get("sha", ""))}
        if path == "/api/log":
            return 200, {"log": tasks.branch_log(params.get("branch", ""))}
        if path == "/api/report":
            return 200, {"report": reports.read_report(params.get("name", ""))}
        if path == "/api/deploys":
            return 200, {"results": search.run(params.get("filter", "{}"))}
    except (ValueError, SyntaxError, PermissionError, FileNotFoundError, IsADirectoryError) as exc:
        return 400, {"error": str(exc)}
    return 404, {"error": "not found"}
