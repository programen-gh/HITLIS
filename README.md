# テーブル設計

## usersテーブル

| column   | type    | options     |
| -------- | ------- | ----------- |
| nickname | string  | null: false |
| password | string  | null: false |

### Association

- has_one :score

## scoresテーブル

| column | type       | options                        |
| ------ | ---------- | ------------------------------ |
| user   | references | null: false, foreign_key: true |
| score  | integer    | null: false                    |

### Association

- belongs_to :user, dependent: :destroy
