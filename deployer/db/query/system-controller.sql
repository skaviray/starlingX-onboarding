-- name: GetSystemController :one
SELECT * FROM system_controller
WHERE id = $1
LIMIT 1;

-- name: DeleteSystemController :exec
DELETE FROM system_controller
WHERE id = $1;
