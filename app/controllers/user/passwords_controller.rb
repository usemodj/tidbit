class User::PasswordsController < Devise::PasswordsController
  # POST /resource/password
  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)

    if successfully_sent?(resource)
      #respond_with({}, :location => after_sending_reset_password_instructions_path_for(resource_name))
      return render :json => {success: true, notice: "sending_reset_password_instructions"}
    else
      #respond_with(resource)
      return render :json => {success: false, notice: "sending_reset_password_failed"}
    end
  end

end
