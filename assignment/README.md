# Assignment

The assignment can also be found on Brightspace.

You will be creating a system to reserve "something". You may decide exactly what the "something" is that users can reserve. Some examples could be:

- One or more seats in a (movie) theatre
- A car or van for a certain day and period from a specific location
- Tables in a restaurant for a specific number of people
- An appointment for a hairdresser with specific actions
- Books in a library for a specific date
- etc.

## Actors

The system must have the following actors:

**User**

The "default" visitor of the website. All users can see the reservable items. However, in order to make a reservation the user should be logged into the system.

**Admin**

An Administrator manages te reservable items. An admin can create, update and remove the items but cannot reserve items. In order to reserve an item the administrator must also be a regular user.

## User stories

| User Story                                                                | Description                                                                                                                                          |
|---------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| US-01 | As a user I want to be able to log in so I can make a reservation.                                                                                   |
|US-02 | As a user I need a real-time overview of the items I can reserve so I will not attempt to make a  reservation for something that cannot be reserved. |
|US-03 | As a user I want an overview of all my reservations so I can I what I reserverd for when.                                                            |
|US-04 | As a user I want to de able to manage my personal data so I can keep it up to date when anything changes.                                            |
|US-05 | As a user&nbsp;I want to be able to reserve more than one item at once.                                                                              |
|US-06 | As a user&nbsp;I would like to be able to cancel a reservation when I no longer intend to use it.                                                    |
|US-07 | As an admin&nbsp;I want to be able to login in so I can create, update or remove reservable items.                                                   |
|US-08 | As an admin&nbsp;I would like to see overviews of reservations per item so I can get an insight in the reservation behaviour of the users.           |   
| US-09 |	As an admin&nbsp;I want to be able to determine how many of a specific item a user can reserve at the same time in order to avoid abuse. |
| US-10	| As an admin&nbsp;I want to be able to deactivate user accounts to maintain the security and safety of the site. |
| US-11	| As an admin&nbsp;I want items to be reservable for a specific date, time and duration so others can also reserve the same item at a different moment. |
| US-12	| As a user I want to be able to make a reservation for a specific date and time.| 




## Requirements

### Functional requirements

| ID | Requirement | Source                  | MoSCow |
| --- | --- |-------------------------| --- |
| FR-01	| There should be a list of reservable items | US-02                   | MUST|
| FR-02	| Users should be able to log in | US-01<br>US-07          | MUST |
| FR-03	| User accounts must be manageable | US-04<br>US-10          | SHOULD |
| FR-04	| The site must be able to display a list of reservable items | US-02<br>US-03<br>US-09 | MUST|
| FR-05	| Items must be reservable for a single user | US-05                   | MUST |
| FR-06	| Reservations can be cancelled at least 24 hours in advance | US-06                   | SHOULD |
| FR-07	| It must be possible to search a specific user | US-10                   | MUST |
| FR-08	| It must be possible to search a specific Item | US-08                   |	MUST |
| FR-09	| It must be possible to search a specific reservation | US-08 | MUST |
| FR-10	| A user must be able to reserve multiple items at once | US-05 | MUST |
| FR-11 | Changes in reservable items must be reflected immediately | US-02 | SHOULD |


### Non Functional requirements

| ID                                                           | Requirement                                                                                                                      | Source	        | MoSCow |
|--------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|----------------|--------|
| NFR-01                                                       | Items must have:<br>- a unique human readable identifier<br>- a maximum amount that can be reserved at a single time             | US-02<br>US-05 | MUST   |
| NFR-02                                                       | Items must be reserved for a specific date, time and duration                                                                    | US-11          | MUST   |
| NFR-03                                                       | User accounts consist of:<br>-an e-mailadres as a username<br>-Roles                                                             | US-01<br>US-07<br>US-08 | MUST   |
| NFR-04                                                       | Reservable items must have at least 3 attributes that can be used to filter. This does not include the human readable identifier | | MUST   |
| NFR-05                                                       | Inputs should be validated on both the client and server                                                                         | | MUST   |
| NFR-06 | Inputs should be sanitized on the server                                                                                         | | MUST   |
| NFR-07 | Server side validation uses regular expressions                                                                                  | | MUST   | 
| NFR-08 | The API returns valid JSON objects or arrays                                                                                     | | MUST   |
| NFR-09 | The API returns appropriate/correct HTTP status codes                                                                            | | 		MUST |
| NFR-10 | The API uses the correct HTTP verbs for its operations | | MUST   |
| NFR-11 | The API implements at least REST level 3 | | MUST   |
| NFR-12 | The API uses query parameters for filtering the result set | | MUST   |
| NFR-13 | The API uses query parameters for sorting the result set	| | SHOULD |
| NFR-14 | The API uses query parameters for limiting the result set | | SHOULD |
| NFR-15 | Both the front-end (client) and backend (server) provide descriptive error messages | | 	MUST  |
| NFR-16 | Both front-end and backend apply the separation of concerns principle | | MUST   |
| NFR-17 | The front-end is build using Svelte (NOT Svelte Kit) | | MUST   |
| NFR-18 | The backend is build using NodeJS with Express | | MUST   |
| NFR-19 | The front-end is composed of (re-usable) components using a logical structure | | MUST   |
| NFR-20 | The API uses JSON Webtokens for authorization | | MUST   |
| NFR-21 | The system uses role-based authentication and authorization | | MUST   |
| NFR-22 | Users can have multiple roles | | MUST   |
| NFR-23 | The REST API must be completely tested with automated tests | | SHOULD |


