# 自尊心ストック（MVP）

キャッチコピー: **小さな「できた」を、貯めていく**

自分専用の「できたこと」記録アプリの最小実装です。
SNS要素（公開・コメント・いいね・共有）は含みません。

## 1. ディレクトリ構成（提案 + 実装済み）

```text
App.tsx
src/
   components/
      EditStockModal.tsx
      RandomStockModal.tsx
      StockCard.tsx
   hooks/
      useAuth.ts
   lib/
      firebase.ts
   screens/
      AuthScreen.tsx
      HomeScreen.tsx
   services/
      authService.ts
      stockService.ts
   theme/
      colors.ts
   types/
      index.ts
   utils/
      formatDate.ts
.env.example
eas.json
```

## 2. 必要パッケージ

このMVPで利用する主なパッケージ:

- `expo`
- `react`
- `react-native`
- `typescript`
- `firebase`

## 3. 各ファイルの役割

- `App.tsx`: 認証状態で `AuthScreen` / `HomeScreen` を切り替え
- `src/lib/firebase.ts`: Firebase初期化（環境変数から設定）
- `src/hooks/useAuth.ts`: `onAuthStateChanged` による認証状態監視
- `src/services/authService.ts`: 新規登録・ログイン・ログアウト・アカウント削除
- `src/services/stockService.ts`: Firestore CRUD + `onSnapshot` リアルタイム購読
- `src/screens/AuthScreen.tsx`: ログイン/新規登録UI
- `src/screens/HomeScreen.tsx`: 投稿作成、履歴一覧、編集モーダル、ランダム表示モーダル、ログアウト/削除
- `src/components/StockCard.tsx`: 投稿カード表示（編集/削除ボタン）
- `src/components/EditStockModal.tsx`: 編集UI（文字数表示つき）
- `src/components/RandomStockModal.tsx`: 過去投稿ランダム1件表示
- `src/types/index.ts`: `UserProfile` と `Stock` 型
- `src/utils/formatDate.ts`: 日本語日時フォーマット

## 4. ローカル起動手順

1. 依存関係をインストール

```bash
npm install
```

2. `.env.example` を `.env` にコピーして Firebase 値を設定

3. 起動

```bash
npx expo start
```

## 5. Firebase 側の設定手順

1. Firebase Console でプロジェクト作成
2. Authentication → Sign-in method で **メール/パスワード** を有効化
3. Firestore Database を作成（本番モード推奨）
4. Webアプリを追加して設定値を取得
5. `.env` に以下を設定

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

## 6. Firestoreデータ構造

```text
users/{uid}
   uid
   email
   createdAt

users/{uid}/stocks/{stockId}
   text
   createdAt
   updatedAt
```

## 7. Security Rules（たたき台）

```txt
rules_version = '2';
service cloud.firestore {
   match /databases/{database}/documents {
      match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;

         match /stocks/{stockId} {
            allow read, write: if request.auth != null && request.auth.uid == userId;
         }
      }
   }
}
```

必要に応じて、`text` の長さや必須フィールドを Rules 側でさらに厳密化してください。

本リポジトリには本番寄りの例として [firestore.rules](firestore.rules) も追加済みです。
適用例:

```bash
firebase deploy --only firestore:rules
```

## 8. EAS Build / Submit（iOS）

1. Expo アカウントでログイン

```bash
npx expo login
```

2. EAS CLI（未導入なら）

```bash
npm i -g eas-cli
```

3. 初期設定

```bash
eas build:configure
```

4. iOSビルド

```bash
eas build -p ios --profile production
```

5. App Store Connect へ提出

```bash
eas submit -p ios --latest
```

## 実装済みMVP機能

- メール/パスワード認証（新規登録・ログイン・ログアウト・削除）
- 投稿作成（trim、空文字禁止、最大200文字、改行可）
- 投稿一覧（自分のみ、新しい順、リアルタイム反映）
- 投稿編集（モーダル、既存値初期表示、文字数表示、保存時 `updatedAt` 更新）
- 投稿削除（確認ダイアログ）
- ホーム表示時のランダム過去投稿モーダル
- 空状態メッセージ
- 投稿成功時メッセージ（Alert）
- アカウント削除時に `users/{uid}/stocks` と `users/{uid}` を先に削除してから Auth ユーザーを削除
