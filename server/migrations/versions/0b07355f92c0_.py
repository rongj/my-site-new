"""empty message

Revision ID: 0b07355f92c0
Revises: d9566a287a3e
Create Date: 2019-04-26 14:09:49.440000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0b07355f92c0'
down_revision = 'd9566a287a3e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_foreign_key(None, 'articles', 'users', ['author_id'], ['id'])
    op.create_foreign_key(None, 'comments', 'articles', ['user_id'], ['id'])
    op.create_foreign_key(None, 'comments', 'articles', ['article_id'], ['id'])
    op.create_foreign_key(None, 'plates', 'categories', ['category_id'], ['id'])
    op.add_column('roles', sa.Column('permissions', sa.Integer(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('roles', 'permissions')
    op.drop_constraint(None, 'plates', type_='foreignkey')
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_constraint(None, 'comments', type_='foreignkey')
    op.drop_constraint(None, 'articles', type_='foreignkey')
    # ### end Alembic commands ###
