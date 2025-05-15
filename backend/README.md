- Start the Backend

```bash
cd backend
make postgres-setup
make createdb
make migrate-up
make start-server
```