FROM golang:1.24 as builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

# RUN chmod +x /app/entrypoint.sh

RUN go build -o main main.go

FROM gcr.io/distroless/base-nossl:debug-nonroot

WORKDIR /

COPY --from=builder /app/main .

# COPY --from=builder /app/entrypoint.sh /entrypoint.sh


EXPOSE 8080

ENTRYPOINT ["/main"]