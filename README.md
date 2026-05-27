# yuki-portfolio

Yukiのポートフォリオサイトです。HTML / CSS / JavaScriptを中心に、制作実績、プロフィール、スキル、問い合わせ導線を掲載します。

## 構成

- `index.html`: トップページ
- `works/index.html`: Works一覧ページ
- `works/*/index.html`: Works詳細ページ
- `about.html`: Aboutページ
- `contact.html`: Contactページ
- `assets/css/`: 共通CSS、コンポーネントCSS、ページ別CSS
- `assets/js/`: 共通ヘッダー、ローディング、ページ別の動作
- `assets/images/`: 表示画像、OGP画像、アイコン
- `data/works.json`: Worksカードと詳細ページの構造化データ
- `data/about.json`: Aboutプロフィールの共通データ
- `content/works/*.md`: Works詳細ページの本文
- `tools/build-content.js`: JSON / MarkdownからHTMLを生成するスクリプト

## データ編集

Works一覧とトップページのWorksカードは `data/works.json` を編集します。

Works詳細ページの本文は `content/works/` 配下のMarkdownを編集します。タイトル、タグ、制作仕様、画像情報などの構造化された情報は `data/works.json` に置きます。

`data/works.json` の `description` は一覧カード用の短い要約です。`content/works/*.md` は詳細ページ本文です。使用技術や使用したAIなどの基本情報は二重に書かず、必要な場所へビルド時に展開します。

Works詳細ページ本文では、Markdown内の通常の改行はWeb表示でも改行として反映されます。空行を入れると段落が分かれ、表示上も間隔が空きます。

使用したAIは `data/works.json` の `aiTools` に配列で記載します。空配列 `[]` の場合、詳細ページには表示されません。

```json
"aiTools": ["ChatGPT", "Claude", "niji・journey"]
```

詳細ページだけに表示したい外部リンクは `detail.links` に記載します。トップページやWorks一覧カードには表示されません。

```json
"detail": {
  "links": [
    {
      "href": "https://www.figma.com/design/...",
      "label": "Figmaデータを見る",
      "external": true
    }
  ]
}
```

Aboutのプロフィールは `data/about.json` を編集します。

## HTML生成

このサイトでは、文章や作品情報の一部を `data/` と `content/` に分けて管理しています。ただし、ブラウザが実際に表示するのは `index.html` や `works/*/index.html` などのHTMLファイルです。

そのため、元データを編集しただけではWeb表示には反映されません。元データからHTMLを書き出す作業が必要です。この書き出し作業を、このプロジェクトでは「ビルド」と呼びます。

```txt
data/works.json
content/works/*.md
data/about.json
        ↓ npm run build
index.html
works/index.html
works/*/index.html
about.html
```

元データを変更したら、次のコマンドでHTMLへ反映します。

```bash
npm run build
```

このコマンドは、トップページ、Works一覧、Aboutプロフィール、Works詳細ページを生成します。生成対象のHTMLを直接編集すると次回ビルドで上書きされるため、内容変更は元データ側で行います。

### よく使う流れ

1. `data/works.json` や `content/works/*.md` を編集する
2. `npm run build` を実行する
3. ブラウザでページを再読み込みして確認する
4. 公開サイトへ反映する場合は、変更した元データと生成後のHTMLをcommit / pushする

### 反映されないとき

- `npm run build` を実行していない
- ブラウザが古い表示をキャッシュしているため、再読み込みが必要
- 生成後のHTMLではなく、元データだけを公開している
- Markdownで段落を分けたい箇所に空行が入っていない

## 運用ルール

サイト構成、データ管理、ビルド手順を変更した場合は、`README.md` を同時に更新します。作業ルールを変更する場合は、`AGENTS.md` と `CLAUDE.md` を同じ内容に保ちます。
