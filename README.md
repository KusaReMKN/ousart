# OUSART

Visible Light USART Communication Experiment

## これはなに

目に見える光を使ってデータを伝送できる、可視光通信の実験システムです。
光検出器としてコンピュータに接続された WEB カメラやスマートフォンのカメラなどを利用するため、特別な機器を必要とせずに可視光通信を体験できます。

## 必要なもの

GitHub Pages で公開されているページを使うだけの場合:

- 適当なブラウザ
- 適当なカメラ

自分で簡易サーバを起動する場合:

- Node.js を実行できる環境
- OpenSSL を実行できる環境

## 実験システムの使い方

<a href="https://kusaremkn.github.io/ousart/">index.html</a> を参照してください。

## 簡易サーバの起動方法

Unix な環境では以下のコマンドを実行するだけで起動できます。

```console
$ ./sslgen.sh	# オレオレ証明書発行
$ npm i
$ npm start
```

## ライセンス

MIT License
