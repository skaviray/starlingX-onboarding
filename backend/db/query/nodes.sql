-- name: CreateNode :one
INSERT INTO nodes (
  name,
  hostname,
  bm_ip,
  bm_user,
  bm_pass,
  link,
  role,
  parent_type,
  parent_id
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8, $9
)
RETURNING *;

-- name: GetNodeById :one
SELECT * FROM nodes
WHERE id = $1 LIMIT 1;

-- name: ListNodes :many
SELECT * FROM nodes 
ORDER BY id
LIMIT $1
OFFSET $2;

-- -- name: UpdateAccount :one
-- UPDATE accounts 
-- SET balance=$2 
-- WHERE id=$1 
-- RETURNING *;

-- name: DeleteNode :exec
DELETE FROM nodes
WHERE id = $1;


-- name: GetControllerNodesBySystemControllerID :many
SELECT id, name, hostname, bm_ip, bm_user, bm_pass, role, parent_type, parent_id, status, created_at
FROM nodes
WHERE parent_type = 'system_controller' AND parent_id = $1 AND role = 'controller'
ORDER BY id;

-- name: GetStorageNodesBySystemControllerID :many
SELECT id, name, hostname, bm_ip, bm_user, bm_pass, role, parent_type, parent_id, status, created_at
FROM nodes
WHERE parent_type = 'system_controller' AND parent_id = $1 AND role = 'storage'
ORDER BY id;

-- name: GetWorkerNodesBySystemControllerID :many
SELECT id, name, hostname, bm_ip, bm_user, bm_pass, role, parent_type, parent_id, status, created_at
FROM nodes
WHERE parent_type = 'system_controller' AND parent_id = $1 AND role = 'worker'
ORDER BY id;