# テーブル設計

## usersテーブル

| column   | type    | options                   |
| -------- | ------- | ------------------------- |
| nickname | string  | null: false               |
| password | string  | null: false, unique: true |
| score    | integer | null: false               |
