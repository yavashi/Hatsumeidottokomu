<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Antigravity Spec-Driven Development (SDD) エージェント規約

本プロジェクト「発明ドットコム (Hatsumeidottokomu)」は、**Google Antigravityが提唱する仕様駆動開発 (Spec-Driven Development: SDD)** に則り開発・運用されます。
エージェント（AI）は、ユーザーの「思いつき」や「頻繁な方針転換」を歓迎し、仕様書を唯一の真実の源 (SSOT) として同期させながら、柔軟かつ破綻のない自律実装を行います。

---

## 1. コア原則: 仕様駆動 (SDD) & 生きた仕様書 (Living Specs)

1. **仕様書が唯一の真実 (SSOT: Single Source of Truth)**
   - チャット上の一時的な指示でコードを直接散発的に修正せず、必ず `specs/` 配下の仕様書を最新の設計として維持する。
   - `specs/constitution.md`: プロジェクト憲章（不変の原則・品質基準・技術選定）
   - `specs/features/*.md`: 機能ごとの個別仕様書（データモデル、画面、コンポーネント）
   - `specs/tasks.md`: 現在のタスク管理表

2. **「思いつき」と「頻繁な仕様変更」への適応プロトコル**
   - ユーザーはアイデアを思いつきベースで逐次変更するため、仕様が頻繁に変わる前提で振る舞う。
   - ユーザーから新しいアイデアや方針変更の指示を受けた場合、以下の**「差分先行サイクル (Spec-Delta Protocol)」**を必ず実行する：
     1. **影響分析 & 仕様差分更新 (Specify)**: 影響を受ける `specs/features/*.md` を特定し、変更・追加・廃止される仕様を先に更新する。
     2. **タスク更新 (Task Plan)**: `specs/tasks.md` に作業タスクを反映する。
     3. **不要コードのクリーンアップ (Prune Dead Code)**: 仕様変更によって不要になった古いコード、コンポーネント、モックデータ、型定義は放置せず、即座に綺麗に削除・置換する。
     4. **実装 & 実行時検証 (Implement & Verify)**: コードを反映後、必ず `npm run lint` や型チェック、ビルドを実行してエラーがないことを確認する。
     5. **完了同期 (Sync)**: `specs/tasks.md` のタスクを完了状態に更新し、ユーザーに簡潔に報告する。

3. **モジュール分割と疎結合の維持**
   - 画面や機能の仕様がガラリと変わってもプロジェクト全体が壊れないよう、コンポーネントおよび仕様書は機能単位（Feature-based）で独立性を高く保つ。

---

## 2. 開発ライフサイクル (Phase Lifecycle)

すべての開発タスクは、以下のフェーズを意識して実行する：

| フェーズ | エージェントの責務 | 関連ファイル |
|---|---|---|
| **1. Specify** | 要件の言語化、ユーザー体験、受け入れ条件の定義 | `specs/features/*.md` |
| **2. Plan** | アーキテクチャ、コンポーネント設計、型定義、データ構造の決定 | `specs/features/*.md`, `src/types/` |
| **3. Tasks** | 作業のチェックリスト化（粒度の細かいタスク分割） | `specs/tasks.md` |
| **4. Implement** | Next.js 16 / React 19 標準に準拠したクリーンな実装 | `src/app/`, `src/components/`, etc. |
| **5. Verify** | 静的解析（ESLint）、TypeScript型チェック、ビルドテスト | `npm run lint`, `npm run build` |
| **6. Sync** | 実装結果を仕様書・タスクリストに反映・完了化 | `specs/tasks.md` |

---

## 3. 技術標準・実装ガイドライン

- **Framework**: Next.js 16 (App Router)
  - `page.tsx`, `layout.tsx` の責務分離
  - インポートパスは `@/...` エイリアスを使用
- **React 19 / TypeScript**:
  - `react-hooks/purity` に準拠（レンダリング時の副作用・`Date.now()` などの不純な呼び出しを避ける）
  - 型定義（`src/types/index.ts`）を厳格に維持
  - 未使用の import や変数を残さない
- **Styling**: Tailwind CSS v4
  - レスポンシブ（モバイル/デスクトップ対応）を標準とする
  - 発明家の想いが伝わる温かみのあるアースカラー／ストーン調のデザインを重視
- **Environment**: Windows PowerShell
  - ターミナルコマンドは PowerShell 互換で実行する（bash 固有構文を使わない）
