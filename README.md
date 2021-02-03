# iDevCamp

Boot Camp RESTful API featuring MERN Stack

- MongoDB
- Express
- React
- Node.js

## Configuration

Update/Add "/config/config.env" and update the following values/settings to your own:

- NODE_ENV=production
- NODE_ENV=development
- PORT=<portInUse>

- MONGO_URI=mongodb+srv://<userName>:<passWord>@<dataBaseName>.o1icy.mongodb.net/<DBName>?retryWrites=true&w=majority

- GEOCODER_PROVIDER=<geoCoderProviderName>
- GEOCODER_API_KEY=<API_KEY>

- FILE_UPLOAD_PATH=./public/uploads
- MAX_FILE_UPLOAD=1000000

- JWT_SECRET=<YourJWTSecret>
- JWT_EXPIRE=30d
- JWT_COOKIE_EXPIRE=30

- SMTP_HOST=<hostName>
- SMTP_PORT=<portNumber>
- SMTP_EMAIL=<email>
- SMTP_PASSWORD=<password>
- FROM_EMAIL=<fromEmail>
- FROM_NAME=<fromName>

## Install Dependencies

```
npm install
```

## Run App

```
# Run in DEV mode
npm run dev

# Run in PROD mode
npm start
```

## Database Seeder

To seed the database with users, coursers and reviews with data from the "\_data" folder, run

```
# Destroy all data
node seeder -d

# Import all data
node seeder -i
```

## Copyright Info

```
- Version: 1.0.0
- License: MIT
- Author: Ratna Lama
- Credits:
  - Brad Traversy
```
