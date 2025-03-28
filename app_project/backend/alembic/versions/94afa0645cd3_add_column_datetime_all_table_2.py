"""Add_column_datetime_all_table_2

Revision ID: 94afa0645cd3
Revises: 3c1337a45d4b
Create Date: 2025-03-18 09:23:28.335534

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '94afa0645cd3'
down_revision: Union[str, None] = '3c1337a45d4b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('Inventory', 'CreatedDate')
    op.alter_column('MaintenanceRequestDetails', 'CreatedDate',
               existing_type=sa.DATETIME(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    """Downgrade schema."""
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('MaintenanceRequestDetails', 'CreatedDate',
               existing_type=sa.DATETIME(),
               nullable=True)
    op.add_column('Inventory', sa.Column('CreatedDate', sa.DATETIME(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
