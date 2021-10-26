FROM golang:latest as development
# Add a work directory
WORKDIR /app
# Cache and install dependencies
COPY go.mod go.sum ./
RUN go mod download
# Copy app files
COPY . .
# Expose port
EXPOSE 9090
# Start app
CMD [ "go", "run", "main.go" ]