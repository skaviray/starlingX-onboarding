-- name: GetSystemController :one
SELECT * FROM system_controller
WHERE id = $1
LIMIT 1;

-- name: DeleteSystemController :exec
DELETE FROM system_controller
WHERE id = $1;

-- name: UpdateSystemControllerStatus :one
UPDATE system_controller
SET status=$2,
failed_reason=$3
WHERE id = $1
RETURNING *;


-- name: UpdateSystemControllerLink :one
UPDATE system_controller
SET link=$2
WHERE id = $1
RETURNING *;