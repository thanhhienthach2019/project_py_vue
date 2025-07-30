from typing import List
from fastapi import HTTPException
from app.core.casbin import enforcer
from app.schemas.settings.policy import PolicyItem, PolicyCreate
from app.core.redis import publish_update


class PolicyService:
    @staticmethod
    def list_policies_permission() -> List[PolicyItem]:
        return [
            PolicyItem(ptype="p", **dict(zip(["v0", "v1", "v2", "v3", "v4", "v5"], row)))
            for row in enforcer.get_policy()
            if len(row) > 2 and row[2] != "view"  
        ]

    @staticmethod
    def list_policies_group() -> List[PolicyItem]:
        return [
            PolicyItem(ptype="g", **dict(zip(["v0", "v1"], row)))
            for row in enforcer.get_grouping_policy()
        ]
    @staticmethod
    
    def list_view_policies() -> List[PolicyItem]:
        view_policies = [
            PolicyItem(ptype="p", **dict(zip(["v0", "v1", "v2", "v3", "v4", "v5"], row)))
            for row in enforcer.get_policy()
            if len(row) >= 3 and row[2] == "view"  
        ]
        return view_policies

    @staticmethod
    async def add_policy(item: PolicyCreate) -> None:
        if item.ptype == "p":
            ok = enforcer.add_policy(item.v0, item.v1, item.v2)
        elif item.ptype == "g":
            ok = enforcer.add_grouping_policy(item.v0, item.v1)
        else:
            raise HTTPException(400, "Invalid policy type")

        if not ok:
            raise HTTPException(400, "Policy already exists or is invalid")

        enforcer.save_policy()
        await publish_update("create", "policy", item.model_dump())

    @staticmethod
    async def remove_policy(item: PolicyCreate) -> None:
        if item.ptype == "p":
            ok = enforcer.remove_policy(item.v0, item.v1, item.v2)
        elif item.ptype == "g":
            ok = enforcer.remove_grouping_policy(item.v0, item.v1)
        else:
            raise HTTPException(400, "Invalid policy type")

        if not ok:
            raise HTTPException(404, "Policy not found")

        enforcer.save_policy()
        await publish_update("delete", "policy", item.model_dump())
