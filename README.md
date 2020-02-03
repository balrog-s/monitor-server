# Are You Here Yet
The purpose of this repository is to store the server side processing for "Are You Here Yet".

This was done as a 48 hour challenge.

**This is a MVP/POC and is not intended to be used by any sort of clients.**


## Running the service

As this service is not dockerized, you will need to have a local instance of Postgres running and run the server with `DATABASE_URL` pointing to your instance of Postgres.

Once this is completed it is recommended to start the service using `npm run start` this will also run the latest migrations for the database. If you are not interested in running the migrations every time you restart or start the server; it is recommended you use `npm run serve` which will just start the server up on port 3000 unless otherwise specified.

## Resource Schemas
This repository uses Joi to validate schemas.
The **User** schema is defined as 

    {
	    id: uuid,
	    username: string,
	    first_name: string,
	    last_name: string,
	    password: encoded(string),
	    created_at: timestamp,
	    updated_at: timestamp
	}
The **Event** schema is defined as

    {
	    id: uuid,
	    user_id: uuid FK reference to users ->> id,
	    data: jsonb,
	    event_type: ['USER_REGISTERED', 'USER_LOGGED_IN', 'USER_CHECKED_IN', 'USER_CHECKED_OUT'],
	    created_at: timestamp,
	    updated_at: timestamp
	}

Utilizing this event schema we can generate views that provide insight into the user activity.

### User Schema Rationale
The User schema could also be expanded to include a phone number and email as well. However, this is something that can easily be added before launch of a full product.

The main data stored for a user here is username, password and their unique id. The username and password is needed to authenticate a user and their unique identifier allows us to reference events back to particular users.

We also have created_at and updated_at columns. This is pretty standard just in case we need to reference this data at some point. The current implementation does not allow users to change any property; however, if a feature such as User Management, Profiles or password reset was introduced then it would make sense that we may want to know when something was last updated at.

### Events Schema Rationale
The Event schema defined allows for a predefined set of events to be stored. This is to ensure that there are no unaccounted or incorrect events in the event store. As the goal is to eventually build projections from this event store we have to ensure that it is not compromised.

Furthermore, no event should ever be deleted. Corrections should be appended to the log and on replay projections should reflect the most current state of resources.

Introducing new events will require modifying the constraint on the `event_type`column of events to include the new event type. This may be troublesome in terms of having to write many migrations modifying that column; however, I believe having the additional validation in the database is worth this hassle.

### Long term goal
Ideally, the goal is to generate **projection tables** from the event store and surface that data for applications.

## Login System
The login system implemented uses a basic JWT implementation without any token expiration.

## Approach
1.	The first step in approaching this is to figure out what the data should look like and what we are going to return to clients.
	- Ask yourself what data we need to store, what is the client going to send and what sort of processing do we need to do.
	- Once you have an idea on what data your service is ingesting, we can build constraints and validation requirements around the data
	- Lastly, we need to solidify a contract with clients regarding what we will be returning
2. The next step is figuring out what libraries/frameworks we want to use.
	- I thought about implementing a graphQL layer to the server and having everything run within a docker container; however for a MVP I believe that would be overkill.
	- I decided to stick with a basic express setup with a few repository files to communicate with our database via **KnexJS** and **Express** for routing
	- For our login system we utilized **jsonwebtoken**
	- The database I decided on was **Postgres**; as that is what I have the most experience with and it was evident from the requirements that FK relations between users and events would be necessary. Also KnexJS allows for easily modifying and building database schemas via their migration and seeding API
3. Error handling
	- Figuring out what error responses we should be returning for certain operations and trying to stick by them
	- **Note:**  Currently this is not being done too well but it can definitely be improved.
4. Testing
	- This is another aspect currently lacking; however given some time bringing in **Jest** to write out a unit test suite would greatly improve the quality of repository. Especially if refactoring is to be done.
5. Developer Tools
	- Adding a auto refresh service such as **nodemon** would make developing in this repository more efficient. As this was a quick prototype I did not invest some time in setting that up; however, if I were to do this again I would invest that time as it would probably save triple that during development.

## Given more time
### 1 Day
Given one more day; I would install **Jest** and begin writing unit test files for the currently existing implementations. I would also need to investigate to find a good code coverage tool. Once I reach 97%+ unit test coverage I could begin refactoring some of the existing code and cleaning up the repository structure to allow easier implementation of new feature. For instance: A controller -> service -> db structure for resources.
### 1 Month
Given one month; I would do the above but also:
	1. Implement a replay system for consuming events and generating projection tables
	2. Improve the quality of error responses and also document a guideline on standards for returning data and errors. This could be done by documenting an OpenAPI 3.0 spec. Also, this may allow us to easily build up an integration test suite (althought I have not yet explored this but it would be a fun to look into)
	3. Solidify the login system. In its current state it is a prototype at best and I am sure there are flaws with it. I would like to take some time to ensure that the system is as air tight as I can get it.