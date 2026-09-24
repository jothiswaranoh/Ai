"""
Shared schema utilities — PyObjectId type and password strength validator.
"""
import re
from typing import Annotated, Any

from bson import ObjectId
from pydantic import GetJsonSchemaHandler
from pydantic_core import core_schema


# ─── MongoDB ObjectId ─────────────────────────────────────────────────────────

class _PyObjectId(str):
    """Pydantic-compatible type that accepts both str and bson.ObjectId."""

    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: Any, _handler: GetJsonSchemaHandler
    ) -> core_schema.CoreSchema:
        return core_schema.union_schema(
            [
                core_schema.str_schema(),
                core_schema.is_instance_schema(ObjectId),
            ],
            serialization=core_schema.plain_serializer_function_ser_schema(
                str,
                return_schema=core_schema.str_schema(),
            ),
        )


PyObjectId = Annotated[str, _PyObjectId]


# ─── Password validation ──────────────────────────────────────────────────────

_PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$")


def validate_strong_password(value: str) -> str:
    """
    Raise ValueError if *value* does not meet strength requirements:
      - At least 8 characters
      - At least one uppercase letter
      - At least one lowercase letter
      - At least one digit
    """
    if not _PASSWORD_PATTERN.match(value):
        raise ValueError(
            "Password must be at least 8 characters and include "
            "at least one uppercase letter, one lowercase letter, and one digit."
        )
    return value
