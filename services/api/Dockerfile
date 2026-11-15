FROM golang:1.27.4-alpine AS builder
WORKDIR /src
COPY services/api/go.mod ./
COPY services/api/*.go ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/transferhub-api .

FROM alpine:3.22
RUN addgroup -S transferhub && adduser -S -G transferhub transferhub
COPY --from=builder /out/transferhub-api /usr/local/bin/transferhub-api
USER transferhub
EXPOSE 8080
ENV ADDR=:8080
ENTRYPOINT ["/usr/local/bin/transferhub-api"]
