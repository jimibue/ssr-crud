import React from "react";
class UserEditForm extends React.Component {
  render() {
    const { id } = this.props.user;
    return (
      <React.Fragment>
        <div>form</div>
        <h1>Add Edit</h1>
        <form action={`http://localhost:3000/users/${id}`} method="post">
          <input type="hidden" name="_method" value="patch" />
          <input
            type="hidden"
            name="authenticity_token"
            value={this.props.authenticity_token}
          />
          <p>first name</p>
          <input
            defaultValue={this.props.user.f_name}
            type="text"
            name="user[f_name]"
            placeholder="First Name"
          />
          <p>last name</p>
          <input
            defaultValue={this.props.user.l_name}
            type="text"
            name="user[l_name]"
          />
          <input type="submit" value="Submit" />
        </form>
      </React.Fragment>
    );
  }
}

export default UserEditForm;
