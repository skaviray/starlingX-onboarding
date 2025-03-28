// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.27.0
// source: bios_settings.sql

package db

import (
	"context"
	"database/sql"
)

const createBiosAttr = `-- name: CreateBiosAttr :one
INSERT INTO bios_settings (
  node_id,
  setting_key,
  setting_value
) VALUES (
  $1, $2, $3
)
RETURNING id, node_id, setting_key, setting_value, last_updated
`

type CreateBiosAttrParams struct {
	NodeID       sql.NullInt32 `json:"node_id"`
	SettingKey   string        `json:"setting_key"`
	SettingValue string        `json:"setting_value"`
}

func (q *Queries) CreateBiosAttr(ctx context.Context, arg CreateBiosAttrParams) (BiosSetting, error) {
	row := q.db.QueryRowContext(ctx, createBiosAttr, arg.NodeID, arg.SettingKey, arg.SettingValue)
	var i BiosSetting
	err := row.Scan(
		&i.ID,
		&i.NodeID,
		&i.SettingKey,
		&i.SettingValue,
		&i.LastUpdated,
	)
	return i, err
}

const getBiosAttr = `-- name: GetBiosAttr :one
SELECT id, node_id, setting_key, setting_value, last_updated FROM bios_settings
WHERE id = $1 LIMIT 1
`

func (q *Queries) GetBiosAttr(ctx context.Context, id int32) (BiosSetting, error) {
	row := q.db.QueryRowContext(ctx, getBiosAttr, id)
	var i BiosSetting
	err := row.Scan(
		&i.ID,
		&i.NodeID,
		&i.SettingKey,
		&i.SettingValue,
		&i.LastUpdated,
	)
	return i, err
}

const listBiosAttr = `-- name: ListBiosAttr :many
SELECT id, node_id, setting_key, setting_value, last_updated FROM bios_settings 
ORDER BY id
LIMIT $1
OFFSET $2
`

type ListBiosAttrParams struct {
	Limit  int32 `json:"limit"`
	Offset int32 `json:"offset"`
}

func (q *Queries) ListBiosAttr(ctx context.Context, arg ListBiosAttrParams) ([]BiosSetting, error) {
	rows, err := q.db.QueryContext(ctx, listBiosAttr, arg.Limit, arg.Offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	items := []BiosSetting{}
	for rows.Next() {
		var i BiosSetting
		if err := rows.Scan(
			&i.ID,
			&i.NodeID,
			&i.SettingKey,
			&i.SettingValue,
			&i.LastUpdated,
		); err != nil {
			return nil, err
		}
		items = append(items, i)
	}
	if err := rows.Close(); err != nil {
		return nil, err
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return items, nil
}
