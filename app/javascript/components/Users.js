import React from "react";
class Users extends React.Component {
  render() {
    const rootURL = "http://localhost:3000";
    return (
      <>
        <a href={`${rootURL}/users/new`}>new user</a>
        Users:{" "}
        {/* map in ruby 
          users.map do |u| 
            <User {...u} />
          end
        */}
        <div>
          {this.props.users.map((u) => (
            <div>
              <div>
                <span>
                  {u.f_name}
                  {u.l_name}
                </span>
                <a href={`${rootURL}/users/${u.id}`}>{" show"}</a>{" "}
                <a href={`${rootURL}/users/${u.id}/edit`}>{" edit"}</a>{" "}
                <a href={`${rootURL}/users/${u.id}`} data-method="delete">
                  {" x"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default Users;

// import React from "react";
// class StarterComponent extends React.Component {
//   render() {
//     const {
//       /* pull anything you need here */
//     } = this.props;

//     //1. can write normal html with the exception of class=> className
//     //2. use {} if you want to write in JS
//     return <></>;
//   }
// }

export default Users;
