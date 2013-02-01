class Admin::BaseController < ApplicationController
  #before_filter :verify_admin
  # CanCan Authorization
  load_and_authorize_resource
  #authorize_resource :class => false
  
  private
  def verify_admin
    redirect_to root_url unless current_user && current_user.has_role?(:admin)
  end
end
