from typing import List
from app.core.casbin import enforcer
from app.schemas.settings.policy import PolicyItem, PolicyCreate
from app.core.redis import publish_update
from app.core.http_exceptions import http_400, http_404, http_409, http_500
from app.schemas.generic_response import GenericResponse


class PolicyService:
    @staticmethod
    def list_policies_permission() -> GenericResponse[List[PolicyItem]]:
        try:
            data = [
                PolicyItem(ptype="p", **dict(zip(["v0", "v1", "v2", "v3", "v4", "v5"], row)))
                for row in enforcer.get_policy()
                if len(row) > 2 and row[2] != "view"
            ]
            return GenericResponse(
                data=data,
                message="notification.fetch.success",
                args={"entity": "Policy"}
            )
        except Exception:
            raise http_400("error.fetch.failed", {"entity": "Policy"})

    @staticmethod
    def list_policies_group() -> GenericResponse[List[PolicyItem]]:
        try:
            data = [
                PolicyItem(ptype="g", **dict(zip(["v0", "v1"], row)))
                for row in enforcer.get_grouping_policy()
            ]
            return GenericResponse(
                data=data,
                message="notification.fetch.success",
                args={"entity": "Policy"}
            )
        except Exception:
            raise http_400("error.fetch.failed", {"entity": "Policy"})

    @staticmethod
    def list_view_policies() -> GenericResponse[List[PolicyItem]]:
        try:
            view_policies = [
                PolicyItem(ptype="p", **dict(zip(["v0", "v1", "v2", "v3", "v4", "v5"], row)))
                for row in enforcer.get_policy()
                if len(row) >= 3 and row[2] == "view"
            ]
            return GenericResponse(
                data=view_policies,
                message="notification.fetch.success",
                args={"entity": "Policy"}
            )
        except Exception:
            raise http_400("error.fetch.failed", {"entity": "Policy"})

    @staticmethod
    async def add_policy(item: PolicyCreate) -> GenericResponse[PolicyItem]:
        # 1. Validate required fields
        missing = ["v0", "v1"] + (["v2"] if item.ptype == "p" else [])
        if not item.v0 or not item.v1 or (item.ptype == "p" and not item.v2):
            raise http_400(
                "error.policy.missing_fields",
                {"fields": missing}
            )

        # 2. Duplicate check
        exists = (
            enforcer.has_policy(item.v0, item.v1, item.v2)
            if item.ptype == "p"
            else enforcer.has_grouping_policy(item.v0, item.v1)
        )
        if exists:
            raise http_409(  # conflict
                "error.policy.already_exists",
                item.model_dump()
            )

        # 3. Invalid type
        if item.ptype not in ("p", "g"):
            raise http_400(
                "error.policy.invalid_type",
                {"type": item.ptype}
            )

        ok = (
            enforcer.add_policy(item.v0, item.v1, item.v2)
            if item.ptype == "p"
            else enforcer.add_grouping_policy(item.v0, item.v1)
        )
        if not ok:
            raise http_500(
                "error.policy.already_exists",
                item.model_dump()
            )

        enforcer.save_policy()
        await publish_update("create", "policy", item.model_dump())

        return GenericResponse(
            data=item,
            message="notification.create.success",
            args={"entity": "Policy"}
        )

    @staticmethod
    async def remove_policy(item: PolicyCreate) -> GenericResponse[None]:
        # 1. Validate required fields
        missing = ["v0", "v1"] + (["v2"] if item.ptype == "p" else [])
        if not item.v0 or not item.v1 or (item.ptype == "p" and not item.v2):
            raise http_400(
                "error.policy.missing_fields",
                {"fields": missing}
            )

        # 2. Existence check
        exists = (
            enforcer.has_policy(item.v0, item.v1, item.v2)
            if item.ptype == "p"
            else enforcer.has_grouping_policy(item.v0, item.v1)
        )
        if not exists:
            raise http_404(
                "error.policy.not_found",
                item.model_dump()
            )

        # 3. Invalid type
        if item.ptype not in ("p", "g"):
            raise http_400(
                "error.policy.invalid_type",
                {"type": item.ptype}
            )

        ok = (
            enforcer.remove_policy(item.v0, item.v1, item.v2)
            if item.ptype == "p"
            else enforcer.remove_grouping_policy(item.v0, item.v1)
        )
        if not ok:
            raise http_500(
                "error.policy.not_found",
                item.model_dump()
            )

        enforcer.save_policy()
        await publish_update("delete", "policy", item.model_dump())

        return GenericResponse(
            data=None,
            message="notification.delete.success",
            args={"entity": "Policy"}
        )
