class HomeController < ApplicationController
  def index

  	respond_to do |format|
	    format.html  # index.html.erb
	    format.json  #{ render :json => "{'name':'Tidbit'}" }
	  end
  end
end
