FROM python:3.10-slim

# Create a non-root user and its home directory
RUN groupadd -r appuser && useradd -r -g appuser -d /home/appuser -s /sbin/nologin -c "Docker image user" appuser
RUN mkdir -p /home/appuser && chown -R appuser:appuser /home/appuser

# Set the HOME environment variable
ENV HOME=/home/appuser

# 设置工作目录
WORKDIR /app

# 先复制依赖文件并安装，利用 Docker 构建缓存
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 将所有后端代码复制到容器内的工作目录
COPY . .

# Change the owner of the directory
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# 暴露 FastAPI 默认使用的端口 8000
EXPOSE 8000

# 运行 FastAPI 应用程序
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
