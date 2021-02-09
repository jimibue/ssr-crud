class UsersController < ApplicationController

  def index
    users = User.all
    # server sided rendering of our react component
    # server is passing back react/html/javascript code
    render component: 'Users', props: { users: users }
  end

  def show
   user = User.find(params[:id])
   render component: "User", props: {user: user, }
  end

  def new
    # with a new form we don't have user
    @user = User.new
    render component: 'UserForm', props: { user:  @user,authenticity_token:session[:_csrf_token] }
  end

  def create
   user = User.new(user_params)
   if user.save
    render component: "User", props: {user: user}
   else
    render component: "UserForm", props: 
    {user: user, authenticity_token:session[:_csrf_token], errors:user.errors.full_messages}
   end
  end


  def edit
    user = User.find(params[:id])
    render component: "UserEditForm", props: 
    {user: user, authenticity_token:session[:_csrf_token] }
   end

   
  def update
   @user = User.find(params[:id])
   if @user.update(user_params)
    redirect_to :users
   else
    render component: "UserEditForm", props: 
    {user: @user, authenticity_token:session[:_csrf_token] }
   end
  end

  def  destroy
    User.find(params[:id]).destroy
    # This is not the best way to do this. normally with
    # react we would just remove the user on the front end, but
    # since we don't really now react we can do this for now
    redirect_to :users
  end

  def user_params
    # <input type="text" name="user[f_name]" placeholder='First Name' />
    params.require(:user).permit(:f_name, :l_name)
  end
end
