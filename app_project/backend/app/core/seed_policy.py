# app/core/seed_policy.py
from app.core.casbin import enforcer

def seed():
    enforcer.clear_policy()

    # USER role
    enforcer.add_policy("user", "menu:dashboard", "view")

     # MANAGER role
    manager_perms = [
        "menu:dashboard", "menu:reports",
        "menu:stock", "menu:stock:in", "menu:stock:out", "menu:stock:onhand", "menu:stock:history"
    ]

    for perm in manager_perms:
        enforcer.add_policy("manager", perm, "view")

    # ADMIN role
    admin_perms = [
        "menu:dashboard", "menu:management", "menu:users", "menu:settings",
        "menu:reports", "menu:stock", "menu:stock:in", "menu:stock:out", "menu:stock:onhand", "menu:stock:history"
    ]

    for perm in admin_perms:
        enforcer.add_policy("admin", perm, "view")

    enforcer.add_role_for_user("admin", "admin")
    enforcer.add_role_for_user("manager", "manager")
    enforcer.add_role_for_user("user", "user")

    enforcer.save_policy()

if __name__ == "__main__":
    seed()