-- name: CreateBiosAttr :one
INSERT INTO bios_settings (
  node_id,
  setting_key,
  setting_value
) VALUES (
  $1, $2, $3
)
RETURNING *;

-- name: GetBiosAttr :one
SELECT * FROM bios_settings
WHERE id = $1 LIMIT 1;

-- name: ListBiosAttr :many
SELECT * FROM bios_settings 
ORDER BY id
LIMIT $1
OFFSET $2;

-- name: ListBiosAttrByNodeId :many
SELECT * FROM bios_settings 
WHERE node_id = $1;


-- -- name: DeleteBiosAttr :exec
-- DELETE FROM nodes
-- WHERE id = $1;