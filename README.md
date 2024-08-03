## Getting Started
### First Load
    1. Clone the repository
    2. write the ".env.local" file at root level (there is a template)
    3. npm install
    4. npm run start / npm run dev

### After first Load
    1.npm run start / npm run dev


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
- Add more tests
- Add swagger documentation
- Standardize the error messages
- Standarize more http status codes