-- name: CreateSystemController :one
INSERT INTO system_controller 
(name,oam_floating,install_file,deploy_file,bootstrap_file,link,status, failed_reason, admin_pass) 
VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *;

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

-- name: UpdateSystemControllerInventory :one
UPDATE system_controller
SET oam_floating = $2
WHERE id = $1
RETURNING *;

-- name: UpdateSystemControllerAdminPass :one
UPDATE system_controller
SET admin_pass = $2
WHERE id = $1
RETURNING *;
