from sqlalchemy.orm import Session
from fastapi import Request
from app.models.router.router_permission import Router

def get_available_routes_service(app, db: Session, router_prefix: str = "/api/v1"):
    existing_routes = db.query(Router.path, Router.method).all()
    existing_set = {(r.path, r.method.upper()) for r in existing_routes}

    available_routes = []

    for route in app.routes:
        if not hasattr(route, "methods") or not hasattr(route, "path"):
            continue

        if route.path.startswith(("/docs", "/openapi", "/redoc")):
            continue

        for method in route.methods:
            trimmed_path = (
                route.path[len(router_prefix):]
                if route.path.startswith(router_prefix)
                else route.path
            )
            key = (trimmed_path, method.upper())
            if key not in existing_set:
                available_routes.append({
                    "path": trimmed_path,
                    "method": method.upper(),
                    "name": route.name,
                })

    return available_routes
