# ROCK SCISSORS PAPER - API 

### copy .env.example to .env

- Node version: 10.16.0

## Installation
- clone repository
- Create a new mongo database called `game`
- Execute

```bash
npm install
```

## Usage

```bash
npm start
```

API will be available at `http://localhost:3002/` if using default configuration

## Rules configuration 

You are able to add rules to default configuration. You can do that editing `config.js` file and adding data in the array `moves` (line 10)

Default configuration:
```bash
    moves: [
        {type:'rock', kills:'scissor'},
        {type:'paper', kills:'rock'},
        {type:'scissor', kills:'string'}
    ]
```

Example configuration:
```bash
    moves: [
        {type:'rock', kills:'scissor'},
        {type:'paper', kills:'rock'},
        {type:'scissor', kills:'string'},
        {type:'string', kills:'dog'},
        {type:'dog', kills:'paper'}
    ]
```

### Note

If you edit default configuration you will have to restart the server