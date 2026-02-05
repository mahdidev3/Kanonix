up:
	docker compose up --build -d

migrate:
	docker compose run --rm api alembic upgrade head

seed:
	docker compose run --rm api python scripts/seed.py

test:
	pytest
