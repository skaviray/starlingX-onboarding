-- name: CreateSystemController :one
INSERT INTO system_controller 
(name,oam_floating,oam_controller_0,oam_controller_1,config,status) 
VALUES ($1,$2,$3,$4,$5,$6) RETURNING *;

-- name: GetSystemController :one
SELECT * FROM system_controller
WHERE id = $1
LIMIT 1;

-- name: ListSystemController :many
SELECT * FROM system_controller
ORDER BY id;
-- LIMIT $1
-- OFFSET $2;

-- name: DeleteSystemController :exec
DELETE FROM system_controller
WHERE id = $1;
