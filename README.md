# template-repo
<!-- Enter a description for the repository -->

## Authors

- Robert Shepley
- Timothee Odushina
- Junyoung Son
- Daniel Frey
- Keelen Fisher

## Documentation
<!-- What does this repository do? Is there anything the user needs to do? Is there an end-user? -->

- Create a `.env` file in the root directory of the cloned repository. Place the following line inside the file.
  
  ```
    DATABASE_URL=postgresql://<username>:<password>@localhost:5432/mtgdb?schema=public
    PORT=<port#>
    ACCESS_TOKEN_SECRET=<Secret>
  ```

  _Note that you will need to have Postgres running on your local machine for this to work. Use an existing username and password (if necessary) in place of the bracketed values, and the migrate command will take care of the rest._

### MVP

User Signs in to the terminal and inputs data through a series of questions, 
Data is stored in the queue, along with third Party APIs that are aligned with the questions.
Terminal acts like the Client Application

### Stretch Goals

Deck Builder? Cards added can be placed into decks
Set rules to the deck
User can only own up to # of cards
Open API Discord Bot
(Optional:) User can import data (their cards) either import a single card or a JSON object with as many cards as you’d like (array of card titles) 

## Document Notes

<!-- Breifly (or as specific as you like) explain your process in building out project tasks from each memeber. How did you create certain routes and functions? -->

- Keelen Fisher: Creating Signin and Signup routes in the repo:
  Goal was to understand bearer auth and how to use jwt. Building the usersSchema was perhaps optional but good to make to understand how a user can create their account on a deeper level. 

## Tests
<!-- Are there any tests? How was it tested? -->

## Further Goals
<!-- Any further goals -->

## Structure Diagram
<!-- Is there a diagram for this project? Should there be one? -->

<!-- Delete any headings that are unused -->
