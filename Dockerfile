# Stage 1: Build React Frontend
FROM node:18-alpine as build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
# Build the app to dist folder
RUN npm run build

# Stage 2: Python Backend
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy FastAPI app
COPY backend/main.py .

# Copy built frontend assets from Stage 1 to 'static' directory
COPY --from=build /app/dist ./static

# Expose port (App Runner usually defaults to 8080)
EXPOSE 8080

# Run FastAPI
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
