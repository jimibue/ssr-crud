import React from "react";
class UserForm extends React.Component {
  render() {
    const { errors } = this.props;
    const { f_name, l_name } = this.props.user;
    const f_name_default = f_name ? f_name : "";
    const l_name_default = l_name ? l_name : "";
    return (
      <React.Fragment>
        <div>form</div>
        <h1>Add User</h1>
        {errors && errors}

        <form action="http://localhost:3000/users" method="post">
          <input
            type="hidden"
            name="authenticity_token"
            value={this.props.authenticity_token}
          />
          <p>first name</p>
          <input
            defaultValue={f_name_default}
            type="text"
            name="user[f_name]"
            placeholder="First Name"
          />
          <p>last name</p>
          <input
            defaultValue={l_name_default}
            type="text"
            name="user[l_name]"
          />
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    );
  }
}

export default UserForm;
