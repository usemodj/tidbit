class ApplicationController < ActionController::Base
  protect_from_forgery
  # Handle Unauthorized Access
  # If the user authorization fails, a CanCan::AccessDenied exception will be raised. 
  # You can catch this and modify its behavior in the ApplicationController.
  rescue_from CanCan::AccessDenied do |exception|
    redirect_to new_user_session_url, :alert => exception.message
  end
  
  private

  # def current_ability
    # # I am sure there is a slicker way to capture the controller namespace
    # controller_name_segments = params[:controller].split('/')
    # controller_name_segments.pop
    # controller_namespace = controller_name_segments.join('/').camelize
    # Ability.new(current_user, controller_namespace)
  # end

  def namespace
    # 2012.3.13 didn't work on Rails 3.0.7, cancan 1.6.7; looks promising, but needs some figuring out.
    #cns = @controller.class.to_s.split('::')
    #cns.size == 2 ? cns.shift.downcase : ""
  
      # I am sure there is a slicker way to capture the controller namespace
      # 2012.3.13 But it works!
      controller_name_segments = params[:controller].split('/')
      controller_name_segments.pop
      controller_namespace = controller_name_segments.join('/').camelize
  end
  
  def current_ability
    # Ability.new(current_user, namespace)
    
    @current_ability ||= Ability.new(current_user, namespace)
  end
end
