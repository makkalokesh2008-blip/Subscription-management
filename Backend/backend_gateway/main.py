from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import logging

from config.settings import settings

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger("gateway")

app = FastAPI(
    title="SubscriptionHub AI Gateway API",
    description="FastAPI gateway forwarding requests to Spring Boot and Node.js search service.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Incoming request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code} for {request.method} {request.url}")
    return response

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP error {exc.status_code}: {exc.detail}")
    return JSONResponse(status_code=exc.status_code, content={"error": exc.detail})

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled exception", exc_info=exc)
    return JSONResponse(status_code=500, content={"error": "Internal server error"})

@app.get(settings.HEALTH_CHECK_PATH, tags=["Health"])
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "SubscriptionHub AI Gateway"}

async def forward_to_spring(request: Request, path: str = "") -> Response:
    target_url = f"{settings.SPRING_BOOT_URL}{settings.API_V1_PREFIX}"
    if path:
        target_url = f"{target_url}/{path}"

    request_body = await request.body()
    forwarded_headers = {
        key: value
        for key, value in request.headers.items()
        if key.lower() not in {"host", "content-length", "accept-encoding", "connection"}
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.request(
                request.method,
                target_url,
                params=request.query_params,
                headers=forwarded_headers,
                content=request_body,
                timeout=30.0,
            )
    except httpx.RequestError as exc:
        logger.error("Spring Boot request failed", exc_info=exc)
        raise HTTPException(status_code=502, detail="Unable to reach Spring Boot backend")

    # FastAPI's CORSMiddleware handles CORS. Strip Spring Boot's CORS headers to avoid double CORS.
    excluded_headers = {
        "content-encoding", "transfer-encoding", "content-length", "connection",
        "access-control-allow-origin", "access-control-allow-credentials",
        "access-control-allow-headers", "access-control-allow-methods",
        "access-control-expose-headers", "access-control-max-age"
    }
    response_headers = {
        key: value
        for key, value in response.headers.items()
        if key.lower() not in excluded_headers
    }

    return Response(
        content=response.content,
        status_code=response.status_code,
        headers=response_headers,
        media_type=response.headers.get("content-type"),
    )

@app.api_route(settings.API_V1_PREFIX, methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def proxy_api_root(request: Request) -> Response:
    if request.method == "OPTIONS":
        return Response(status_code=200) # Preflight is handled by CORSMiddleware
    return await forward_to_spring(request)

@app.api_route(f"{settings.API_V1_PREFIX}/{{full_path:path}}", methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"])
async def proxy_api(request: Request, full_path: str) -> Response:
    if request.method == "OPTIONS":
        return Response(status_code=200) # Preflight is handled by CORSMiddleware
    return await forward_to_spring(request, full_path)

