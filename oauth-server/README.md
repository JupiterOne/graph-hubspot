# oauth-server

### Setup & Run

`docker build -t ghos .`

`docker run -it -v $(pwd)/.env:/app/.env -p 3000:3000 ghos`

## How-To use

1. Navigate to http://localhost:3000
2. If a token in already saved it will be displayed
3. Navigate to http://localhost:3000/redirect to refresh the token
