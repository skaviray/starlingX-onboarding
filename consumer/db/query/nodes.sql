-- name: GetNodeById :one
SELECT * FROM nodes
WHERE id = $1 LIMIT 1;

-- name: UpdateNodeProperties :one
UPDATE nodes 
SET hostname=$2,
bm_ip=$3,
bm_user=$4,
bm_pass=$5,
role=$6,
parent_type=$7,
parent_id=$8,
status=$9
WHERE id=$1 
RETURNING *;

-- name: DeleteNode :exec
DELETE FROM nodes
WHERE id = $1;
