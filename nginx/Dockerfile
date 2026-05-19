FROM nginx:alpine

# Instalar openssl
RUN apk add --no-cache openssl

# Copiar o script de inicialização que gera o certificado se ele não existir
COPY generate-ssl.sh /docker-entrypoint.d/99-generate-ssl.sh
RUN chmod +x /docker-entrypoint.d/99-generate-ssl.sh

# Copiar a configuração do Nginx (que já aponta para /etc/nginx/ssl/)
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
