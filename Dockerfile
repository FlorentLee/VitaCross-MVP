# Stage 1: Frontend Build
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend

# Use npm registry mirror for speed and accessibility in China
RUN npm config set registry https://registry.npmmirror.com

# Copy package config files
COPY frontend/package.json frontend/package-lock.json ./

# Install frontend dependencies
RUN npm ci

# Copy frontend source files
COPY frontend/ ./

# Build Next.js app to static HTML export (configured in next.config.mjs)
RUN npm run build

# Stage 2: Backend and Serving
FROM python:3.10-slim

# Use PyPI mirror for speed and accessibility in China
RUN pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user (UID 1000) for Hugging Face Spaces compatibility
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH
WORKDIR $HOME/app

# Copy Python requirements first to leverage Docker layer caching
COPY --chown=user backend/requirements.txt ./

# Install python dependencies including backend requirements, langchain, and zhipuai
RUN pip install --no-cache-dir --user -r requirements.txt && \
    pip install --no-cache-dir --user langchain zhipuai

# Copy Python backend application files
COPY --chown=user backend/ ./

# Copy Next.js static build files into the static folder served by FastAPI
COPY --from=frontend-builder --chown=user /app/frontend/out ./static

# Expose port 7860 as required by Hugging Face Spaces
EXPOSE 7860

# Environment variables
ENV PORT=7860
ENV PYTHONUNBUFFERED=1

# Start the FastAPI application with Uvicorn
CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
