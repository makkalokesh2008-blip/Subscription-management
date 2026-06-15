# Subscription Management System Backend

FastAPI backend gateway for user authentication, profile management, subscription plans, payments, and subscriptions.

## Features

- PostgreSQL persistence with SQLAlchemy
- JWT authentication
- Email and password login
- ADMIN and USER roles
- Plan CRUD APIs
- Subscription creation and cancellation APIs
- Payment APIs
- Profile APIs

## Setup

Create a PostgreSQL database named `subscription_management`, then install dependencies:

```bash
pip install -r requirements.txt
```

Optional `.env` file:

```env
DATABASE_URL=postgresql+psycopg://postgres:root@localhost:5432/subscription_db
JWT_SECRET_KEY=replace-with-a-secure-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
API_V1_PREFIX=/api/v1
```

Run the application:

```bash
python run.py
```

API docs are available at:

- `http://localhost:8001/docs`
- `http://localhost:8001/redoc`

## Main Routes

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/users/me`
- `PUT /api/v1/users/me`
- `DELETE /api/v1/users/me`
- `POST /api/v1/plans/`
- `GET /api/v1/plans/`
- `GET /api/v1/plans/{plan_id}`
- `PUT /api/v1/plans/{plan_id}`
- `DELETE /api/v1/plans/{plan_id}`
- `POST /api/v1/subscriptions/`
- `GET /api/v1/subscriptions/me`
- `PATCH /api/v1/subscriptions/{subscription_id}/cancel`
- `POST /api/v1/payments/`
- `GET /api/v1/payments/me`
