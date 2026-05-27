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

Aboutのプロフィールは `data/about.json` を編集します。

## HTML生成

元データを変更したら、次のコマンドでHTMLへ反映します。

```bash
npm run build
```

このコマンドは、トップページ、Works一覧、Aboutプロフィール、Works詳細ページを生成します。生成対象のHTMLを直接編集すると次回ビルドで上書きされるため、内容変更は元データ側で行います。

## 運用ルール

サイト構成、データ管理、ビルド手順を変更した場合は、`README.md` を同時に更新します。作業ルールを変更する場合は、`AGENTS.md` と `CLAUDE.md` を同じ内容に保ちます。
