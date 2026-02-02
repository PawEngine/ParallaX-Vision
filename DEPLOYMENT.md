# ParallaX-Vision デプロイガイド (AWS App Runner)

ParallaX-Vision を AWS App Runner にデプロイするための手順書です。
App Runner はコンテナイメージをソースとして、オートスケーリングやロードバランシング含むWebアプリケーション環境を簡単に構築できるマネージドサービスです。

## 前提条件

- AWS アカウントを持っていること
- AWS CLI がインストール・設定されていること (`aws configure`)
- Docker がインストールされていること

## 手順 1: Amazon ECR リポジトリの作成

Dockerイメージを保存するためのリポジトリを作成します。

```bash
# リポジトリ名: parallax-vision
aws ecr create-repository --repository-name parallax-vision --region ap-northeast-1
```

※ `ap-northeast-1` は東京リージョンです。

## 手順 2: Dockerイメージのビルドとプッシュ

1. **ECRへのログイン**

   ```bash
   aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com
   ```

   ※ `<AWS_ACCOUNT_ID>` はご自身の12桁のAWSアカウントIDに置き換えてください。

2. **イメージのビルド**

   ```bash
   # Linux/amd64 プラットフォーム向けにビルド (Mac M1/M2 等の場合必須)
   docker build --platform linux/amd64 -t parallax-vision .
   ```

3. **タグ付け**

   ```bash
   docker tag parallax-vision:latest <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/parallax-vision:latest
   ```

4. **プッシュ**
   ```bash
   docker push <AWS_ACCOUNT_ID>.dkr.ecr.ap-northeast-1.amazonaws.com/parallax-vision:latest
   ```

## 手順 3: AWS App Runner サービスの作成

1. **AWSマネジメントコンソール** で [App Runner] を開く。
2. **[サービスの作成]** をクリック。
3. **ソース**:
   - リポジトリタイプ: **Container Registry**
   - プロバイダー: **Amazon ECR**
   - コンテナイメージのURI: 先ほどプッシュしたURI (`.../parallax-vision:latest`)
4. **デプロイ設定**:
   - トリガー: **自動** (推奨: イメージ更新時に自動デプロイされる) または **手動**
   - ECRアクセスロール: [新しいサービスロールの作成] (初回のみ)
5. **構築設定**:
   - 変更なし (Dockerfileの内容に従うため不要)
6. **サービス設定**:
   - サービス名: `parallax-vision-service`
   - 仮想CPU / メモリ: `1 vCPU / 2 GB` (推奨)
   - 環境変数: 必要であれば追加
   - ポート: `8080` (重要: DockerfileでEXPOSEしているポート)
7. **確認**:
   - 設定を確認し、**[作成とデプロイ]** をクリック。

## アプリケーションへのアクセス

デプロイが完了すると「デフォルトドメイン」が表示されます (例: `https://xyz.ap-northeast-1.awsapprunner.com`)。
このURLにアクセスし、カメラ許可を承諾すれば、ParallaX-Vision が動作します。

## 注意事項

- **HTTPS必須**: App Runner はデフォルトで HTTPS を提供します。カメラ使用には HTTPS が必須なので最適です。
- **コスト**: 実行中は課金されます。不要になったらサービスを **一時停止** または **削除** してください。
