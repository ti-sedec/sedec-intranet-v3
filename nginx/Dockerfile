FROM nginx:alpine

# Instalar openssl
RUN apk add --no-cache openssl

# Criar diretório para o certificado
RUN mkdir -p /etc/nginx/ssl

# Gerar certificado autoassinado (validez de 3650 dias = 10 anos)
RUN openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout /etc/nginx/ssl/server.key \
    -out /etc/nginx/ssl/server.crt \
    -subj "/C=BR/ST=MT/L=Cuiaba/O=SEDEC/CN=localhost"

# Copiar a configuração do Nginx (que já aponta para /etc/nginx/ssl/)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
