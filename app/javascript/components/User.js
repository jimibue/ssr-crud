import React from "react";
class User extends React.Component {
  render() {
    return (
      <>
        <div className="red">
          {this.props.user.f_name}
          {this.props.user.l_name}
          <a href={`http://localhost:3000/`}>back</a>
          <a
            href={`http://localhost:3000/users/${this.props.user.id}`}
            data-method="delete"
          >
            {" x"}
          </a>
        </div>
      </>
    );
  }
}

export default User;
