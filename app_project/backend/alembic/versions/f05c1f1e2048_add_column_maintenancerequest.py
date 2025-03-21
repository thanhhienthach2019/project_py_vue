"""Add column MaintenanceRequest

Revision ID: f05c1f1e2048
Revises: fb9925912d84
Create Date: 2025-03-18 08:33:05.225012

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f05c1f1e2048'
down_revision: Union[str, None] = 'fb9925912d84'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('MaintenanceRequests', sa.Column('ApprovedAt', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('MaintenanceRequests', 'ApprovedAt')
    # ### end Alembic commands ###
