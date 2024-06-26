#! /bin/sh

if [ "$1" = "clean" ]
then
	rm -f server_key.pem server_csr.pem server_crt.pem
	exit 0
fi

if ! which openssl >/dev/null
then
	echo 'openssl is required but not found!' >/dev/null
	exit 1
fi

openssl genrsa 2048 \
	>server_key.pem

yes '' \
	| openssl req -new -key server_key.pem \
	>server_csr.pem

cat server_csr.pem \
	| openssl x509 -days 3650 -req -sha256 -signkey server_key.pem \
	>server_crt.pem
