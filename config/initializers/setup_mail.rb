ActionMailer::Base.smtp_settings = {
  :address              => "smtp.gmail.com",
  :port                 => 587,
  :domain               => "tidbiki.com",
  :user_name            => "tidbiki@gmail.com",
  :password             => "myPassword",
  :authentication       => "plain",
  :enable_starttls_auto => true
}

ActionMailer::Base.default_url_options[:host] = "localhost:3000"
#Mail.register_interceptor(DevelopmentMailInterceptor) if Rails.env.development?

# lib/development_mail_interceptor.rb
# class DevelopmentMailInterceptor
  # def self.delivering_email(message)
    # message.subject = "#{message.to} #{message.subject}"
    # message.to = "ryan@railscasts.com"
  # end
# end
