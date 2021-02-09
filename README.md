# RAILS AND REACT

> this is a intro to using rails with react. The way this is being done is by server side rendering react. We will talk about client side rendering later and discuss the pros and cons of both.
> starting point reference
> https://medium.com/swlh/getting-started-with-rails-6-and-react-afac8255aecd

## Setup (outdated but show basic react/rails setup)

### create new rails app

`rails new PROJECT_NAME -d postgresql --webpack=react`

### install faker

`gem 'faker', :git => 'https://github.com/faker-ruby/faker.git', :branch => 'master'`

### add react rails (in terminal)

`bundle add react-rails`

### setup faker/db

```ruby
  require "faker"

  25.times do
    first_name = Faker::Name.first_name
    last_name = Faker::Name.last_name
    User.create(f_name: first_name, l_name: last_name)
  end
```

`rails db:create db:migrate db:seed`

### setup model/routes/controller

Let’s generate resources for a User this is like model but gives us a controller and routes as
well as a model and migration files
`rails g resource User f_name:string l_name:string`

### setup react and rails

Let’s run the install command now, which will add some additional files to our Rails project:

`rails g react:install`

> adds packages to package.json and requires in app/javascript/packs/application.js.

## Adding a component

### create a users 'component'

`rails g react:component Users users:array`

> By specifying users:array we are stating that the component should expect a prop called users which is an array

this is what is generated, let's remove PropType stuff for now

> /app/javascript/components/Users.js

```javascript
import React from "react";
import PropTypes from "prop-types";
class Users extends React.Component {
  render() {
    return <React.Fragment>Users: {this.props.users}</React.Fragment>;
  }
}

Users.propTypes = {
  tests: PropTypes.array,
};
export default Users;
```

### Get data in our controller and render our react component server side

props is what a react component will take as it initial data, here we are giving our
Users component users props

```ruby
class UsersController < ApplicationController
  def index
    @users = User.all
    # server sided rendering of our react component
    # server is passing back react/html/javascript code
    render component: 'Users', props: { users: @users }
  end
end
```

```javascript
import React from "react"
class Users extends React.Component {
  render () {
  // props is what we pass to components we also need to call
  // super so the Component class we are extending gets the props
  constructor(props) {
    super(props);
    // state is how we manage changes to our component
    this.state = {
      users: this.props.users
    };
    return (
      <div>
        <h1>All Users</h1>
        <ul>
          {this.state.users.map(user => (
            <li key={user.id}>
              {`${user.f_name} ${user.l_name}`}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
export default Users
```

## Show and Delete Methods

we are going to e doing some 'ajax' calls so we need set this up

### setting up api calls. Add axios and disable protect_from_forgery

`yarn add axios`

```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :null_session
end
```

### Users.js

let's put our map function in a seperate function in our Users component to help
keep our code clean

```javascript
  renderUsers() {
    // map over our users and create an array of them JSX
    return this.state.users.map(user => (
      <li key={user.id}>
        {/* display user name */}
        {`${user.f_name} ${user.l_name}`}

        {/* delete user name */}
        <div onClick={() => this.deleteUser(user.id)}>delete</div>

        {/* show user */}
        <a href={`http://localhost:3000/users/${user.id}`}>show user</a>
      </li>
    ));
  }
```

function to add a random user using axios(ajax)

```javascript
  // a example with a axios post request (Promise here)
  addRandomUser() {
    axios
      .post("http://localhost:3000/users", {
        f_name: "User",
        l_name: `${Math.floor(Math.random() * 100)}`
      })
      .then(response => {
        console.log(response);
        const newUser = response.data
        // calling setState will trigger the render function to be called
        this.setState({
          // adding new user to the begging of the array
          users: [newUser, ...this.state.users]
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }
```

function to add delete user

```javascript
// a example with a axios delete request (Promise here)
deleteUser = (id) => {
  const { users } = this.state;
  axios.delete("/users/" + id).then((res) => {
    // status ok
    console.log(res);
    if (res.status != 200) {
      alert("failed to deleted should refresh page");
    }
    // get deleted user from database
    const deletedUser = res.data;
    //user deleted from database but we need to update our UI
    const newUsers = users.filter((user) => user.id != deletedUser.id);
    this.setState({
      users: newUsers,
    });
  });
};
```

## setup user

`rails g react:component User`

```javascript
import React from "react";
class User extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.user.f_name}
        {this.props.user.l_name}
        <a href={`http://localhost:3000/`}>back</a>
      </React.Fragment>
    );
  }
}

export default User;
```

## user controller

```ruby

class UsersController < ApplicationController
  def index
    @users = User.all
    # server sided rendering of our react component
    # server is passing back react/html/javascript code
    render component: "Users", props: { users: @users }
  end

  def show
    @user = User.find(params[:id])
    # server sided rendering of our react component
    # server is passing back react/html/javascript code
    render component: "User", props: { user: @user }
  end

  def create()
    @user = User.create(user_params)
    # not passing backing html or js, just json
    render json: @user
  end

  def destroy
    @user = User.destroy(params[:id])
    # not passing backing html or js, just json
    render json: @user
  end

  private

  def user_params
    params.require(:user).permit(:f_name, :l_name)
  end
end

```

## Users.js

```javascript
import React from "react";
import axios from "axios";

// - React writes its html in a javascript file called jsx
// - this means in our html we can write javascript by using brackets {}
// - in react there is state and props, props is what is first passed to the
//   component and state is there to handle changes to, well the state of the
//   component
//   we are using axios to do are api calls, but our routes still match what    //   they do in rails
class Users extends React.Component {
  // props is what we pass to components we also need to call
  // super so the Component class we are extending gets the props
  constructor(props) {
    super(props);
    // state is how we manage changes to our component
    this.state = {
      users: this.props.users,
    };
  }

  // a example with a axios post request (Promise here)
  addRandomUser() {
    axios
      .post("http://localhost:3000/users", {
        f_name: "User",
        l_name: `${Math.floor(Math.random() * 100)}`,
      })
      .then((response) => {
        console.log(response);
        const newUser = response.data;
        // calling setState will trigger the render function to be called
        this.setState({
          // adding new user to the begging of the array
          users: [newUser, ...this.state.users],
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  // a example with a axios delete request (Promise here)
  deleteUser = (id) => {
    const { users } = this.state;
    axios.delete("/users/" + id).then((res) => {
      // status ok
      console.log(res);
      if (res.status != 200) {
        alert("failed to deleted should refresh page");
      }
      // get deleted user from database
      const deletedUser = res.data;
      //user deleted from database but we need to update our UI
      const newUsers = users.filter((user) => user.id != deletedUser.id);
      this.setState({
        users: newUsers,
      });
    });
  };

  renderUsers() {
    // map over our users and create an array of them JSX
    return this.state.users.map((user) => (
      <li key={user.id}>
        {/* display user name */}
        {`${user.f_name} ${user.l_name}`}

        {/* delete user name */}
        <div onClick={() => this.deleteUser(user.id)}>delete</div>

        {/* show user */}
        <a href={`http://localhost:3000/users/${user.id}`}>show user</a>
      </li>
    ));
  }

  // render must be defined in all react classes it is what is responsible for
  // rendering html to page
  render() {
    return (
      <div>
        <h1>All Users</h1>
        <div onClick={() => this.addRandomUser()}>add random user</div>
        <ul>{this.renderUsers()}</ul>
      </div>
    );
  }
}

export default Users;
```

## create a user

rails g react:component UserForm

protect_from_forgery with: :null_session
