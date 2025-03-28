-- name: CreateSubcloud :one
INSERT INTO subcloud 
(name,system_controller_id, ip_address, sync_status) 
VALUES ($1,$2,$3,$4) RETURNING *;

-- name: GetSubcloud :one
SELECT * FROM subcloud
WHERE id = $1
LIMIT 1;

-- name: ListSubclouds :many
SELECT * FROM subcloud
ORDER BY id;
-- LIMIT $1
-- OFFSET $2;

-- name: DeleteSubcloud :exec
DELETE FROM subcloud
WHERE id = $1;