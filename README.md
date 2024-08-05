## Getting Started
### First Load
    1. Clone the repository
    2. write the ".env.local" file at root level (there is a template)
    3. npm install
    4. npm run start / npm run dev
    (the project was made with 20.11.0 node version)

### After first Load
    1.npm run start / npm run dev

### Postman
    1. Import the postman collection from the root folder
    2. Run the requests

### Database Modification


| __SecretSanta__      |
| :------------------------- |
|id : uuid|
| gifterId : uuid |
| gifteeId : uuid |
| year : int|
|__groupId : uuid__ |<- added this field

this field was added to get history of secret santas for previous years easier

without groupId as a foreign key in ___SecretSanta___ collection, the join to recover the history is painfully slow, it involves a lot of cartesian products

for more information on implementation results see 
- [app/api/secret_santa/[group_id]/route.ts](https://github.com/Centorios/SiriusChallenge/blob/main/app/api/secret_santa/%5Bgroup_id%5D/route.ts)



## API Reference

___
#### Create a new person
```http
  POST /api/person
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `JSON` | { "name" : string } |

___
#### Create a new group
```http
  POST /api/group
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `body` | `JSON` | { "name" : string } |

___
#### Add a person to a group
```http
  POST /api/group/add/[person_id]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `person_id` | `string` | person_id without quotes |
| `body` | `JSON` | { "name" : string } (the name of the group) |

___
#### Rolls a new set of secret santas for a group (no one can be their own secret santa but allows repetition through years)
```http
  POST /api/V1/secret_santa/[group_id]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `group_id` | `string` | group_id without quotes |

___

#### Rolls a new set of secret santas for a group (checks for repetitions within the previous 3 years)
```http
  POST /api/V2/secret_santa/[group_id]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `group_id` | `string` | group_id without quotes |

___
#### Get history of secret santas for previous years
```http
  GET /api/secret_santa/[group_id]
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `group_id` | `string` | group_id without quotes |

___

## TO-DOs and Improvements
- Dockerize the app to use local mongoDB
- Add swagger documentation
- Standardize the error messages
- Autodeploy to heroku/vercel