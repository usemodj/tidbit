class User::RegistrationsController < Devise::RegistrationsController
  def create
    build_resource
    
    if resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)
        # respond_with resource, :location => after_sign_up_path_for(resource)
        return render :json => {:success => true, :notice =>"signed_up"}
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_session_data_after_sign_in!
        # respond_with resource, :location => after_inactive_sign_up_path_for(resource)
        return render :json => {:success => true, :notice => "signed_up_but_#{resource.inactive_message}"}
      end
    else
      clean_up_passwords resource
      # respond_with resource
      return render :json => {:success => false, :notice =>'signed_up_failed'}
    end
  end
 
  # Signs in a user on sign up. You can overwrite this method in your own
  # RegistrationsController.
  def sign_up(resource_name, resource)
    sign_in(resource_name, resource)
  end
end
