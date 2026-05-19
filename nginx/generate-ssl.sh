#!/bin/sh

mkdir -p /etc/nginx/ssl

if [ ! -f /etc/nginx/ssl/server.crt ]; then
    echo "Gerando certificado autoassinado..."
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/server.key \
        -out /etc/nginx/ssl/server.crt \
        -subj "/C=BR/ST=MT/L=Cuiaba/O=SEDEC/CN=localhost"
else
    echo "Certificado já existe, pulando geração e reutilizando o atual."
fi
