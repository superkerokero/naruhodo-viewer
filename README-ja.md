# naruhodo-viewer

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English version](README.md)

`naruhodo-viewer`は[naruhodo](https://github.com/superkerokero/naruhodo)で生成されたグラフをインターラクティブに表示するウェブアプリです。

![A snapshot of naruhodo-viewer webapp](img/snapshot1.png)

## インストール

まずは[naruhodo](https://github.com/superkerokero/naruhodo)をインストールする必要があります。 `naruhodo`のインストールに関する情報は [ここ](https://github.com/superkerokero/naruhodo/blob/master/README-ja.md#インストール)に載せています。

それからはこのリポジトリをローカルに`git clone`してください:

```bash
git clone https://github.com/superkerokero/naruhodo-viewer.git
```

`git clone`したリポジトリのルートフォルダに移動して、`config.json` ファィルを編集します:

```json
{
    "mp": false,
    "wv": "",
    "debug": false
}
```

`mp` を `true` にする事で、 `naruhodo` のマルチプロセシング機能を利用します（マルチコアのCPUでスピードアップする可能性があります）。デフォルトは`false`です。 

`naruhodo` に実装された試験的な共参照解析機能を利用するには、`wv` を word2vec のモデルにパスに変える必要があります。word2vec のモデルがなければ、"" のままで結構です。

全ての使えるオプションは[オプション](https://github.com/superkerokero/naruhodo-viewer/blob/master/README-ja.md#オプション)セクションで確認できます。

次にルートフォルダに移動してターミナルを開き、このコマンドでウェブサーバーを起動します:

```bash
python viewer.py config.json
```

ブラウザでこのアドレスから `naruhodo-viewer` にアクセスします。

```
http://localhost:8000
```

## 基本的な利用方法

一番上の入力欄でモードに応じてテキストやURLを入力し、`ADD` をクリックすればグラフに内容を追加できます。

![Input bar](img/snapshot2.png)

`Setting` ボタンで設定メニューを表示させます。

![Setting button](img/snapshot3.png)

ノードにマウスポインターを移動すれば（モバイルデバイスならノードにタップ）、ノードの元となる文とその文の番号（全体の位置）が見れます。

![Node popup](img/snapshot4.png)

`naruhodo`のスクレーパー機能を利用して、直接ウェブぺージの内容をグラフに追加できます。ただグラフのノード数が大きすぎると性能が著しく落ちますので、注意が必要です。

![Webpage added to graph](img/snapshot5.png)

## オプション

| name        | default            | description                                 |
|-------------|--------------------|---------------------------------------------|
| mp          | false              | Use multiprocessing in naruhodo or not.     |
| wv          | ""                 | Path to your word2vec model.                |
| debug       | false              | Debug mode                                  |
| server_ip   | "http://localhost" | IP address of your naruhodo-viewer server.  |
| server_port | 8000               | Port number of your naruhodo-viewer server. |