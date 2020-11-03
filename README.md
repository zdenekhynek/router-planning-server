# Route planning server

An Express API app returns planned journeys

## Endpoints


### Journeys endpoint

Post:

```
<API_HOST>/api/v1/journeys/
```

with payload:

```
{
	"region": "Scottish Highlands",
	"dates": ["2020-12-01", "2020-12-14"],
	"types": ["city", "outdoor"]
}
```

e.g.

```
http://localhost:5000/api/v1/directions/51.5710352,-0.09261149999999999/51.5452153,-0.07491830000000001
```

## Setup

### Requirements

- node - v12.x
- npm

Install all dependencies with

```
npm i
```

Create an `.env` file in the project root with TFL API credentials similar to

```
GOOGLE_API_KEY=<your_google_api_key>
```

## Development

Run

```
npm run start
```

## Tests

```
npm run test:watch
```

## Deployment

Push to the heroku remote with:

```
git push heroku
```
