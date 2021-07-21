## Simple Phonebook App with React and Express

<br/>

<p align="center">
   Check the final result deployed to Hereku <a href="https://delicat-fromage-63869.herokuapp.com/">here</a>.
</p>

<br/>

This is my implementation to problems 3.9 ~ 3.11 from [FullStackOpen](https://fullstackopen.com/en/)

It's a simple application that displays and saves new contacts to a backend with express. There isn't a database yet, therefore the modifications will persist only during a session.

The build folder that contains all the static files is the result from a `npm run build` on the React Phonebook project in this [repo](https://github.com/dbonach/helsinki-fullstackopen/tree/main/part2/phonebook).

In this project instead of a JSON Server, it is using the framework [Express](https://expressjs.com/) as the backend.

The files are configured to be deployed to Heroku.

<br/>

### How it works

- The input filtes and shows the contacts that match with the partial name being typed.
- If a new name is added, a post request will be generated and from its response the app state will be updated with the new contact.
- Clicking on `remove` will generate a delete request to the JSON Server and then the app state will be updated.
- When a contact is added a success message is shown.
- If the user tries to remove a contact that was already removed, an error message will be shown.
- The backend has endpoints to get, post and delete contacts. The update function wasn't implemented yet.

<br/>

### How to run

You can run it locally by cloning the repo, run `npm install` to install all dependencies and then `npm start` or `npm run dev` to run it in development mode that enables an auto reload for changes in the main application.

<br/>

### Gif showing it working 
<p>
<img src="https://user-images.githubusercontent.com/62313672/124419635-40cac300-dd34-11eb-8737-c1c6ba9bbfd9.gif" width="40%">
</p>
