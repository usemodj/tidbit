class Ability
  include CanCan::Ability

=begin
  def initialize(user, controller_namespace)
    case controller_namespace
      when 'Admin'
        can :manage, :all if user.has_role? 'admin'
      else
        # rules for non-admin controllers here
    end
  end
=end

  def initialize(user, controller_namespace)
    # Define abilities for the passed in user here. For example:
    #
    #   user ||= User.new # guest user (not logged in)
    #   if user.admin?
    #     can :manage, :all
    #   else
    #     can :read, :all
    #   end
    #
    # The first argument to `can` is the action you are giving the user permission to do.
    # If you pass :manage it will apply to every action. Other common actions here are
    # :read, :create, :update and :destroy.
    #
    # The second argument is the resource the user can perform the action on. If you pass
    # :all it will apply to every resource. Otherwise pass a Ruby class of the resource.
    #
    # The third argument is an optional hash of conditions to further filter the objects.
    # For example, here the user can only update published articles.
    #
    #   can :update, Article, :published => true
    #
    # See the wiki for details: https://github.com/ryanb/cancan/wiki/Defining-Abilities
    
    # if user.role? :moderator
      # can :manage, Project
      # cannot :destroy, Project
      # can :manage, Comment
    # end
    # if user.role? :admin
      # can :destroy, Project
    # end

=begin
  user ||= User.new # guest user 
  if user.role? :super_admin
    can :manage, :all #This shows that the super_admin can manage everything

  elsif user.role? :product_admin
    can :manage, [Product, Asset, Issue] # Show that the product_admin can manage products and its related other things.

  elsif user.role? :product_team
    can :read, [Product, Asset]  # manage products, assets he owns
    can :manage, Product do |product|
      product.try(:owner) == user
    end
    can :manage, Asset do |asset|
      asset.assetable.try(:owner) == user
    end
  end 
=end

   #puts(".... controller_namespace: #{controller_namespace}")
   user ||= User.new # guest user (not logged in)
   case controller_namespace
      when 'Admin'
        can :manage, :all if user.has_role? :admin
      else
        # rules for non-admin controllers here
        #can :read, :all
        # can [:update, :destroy], [Article, Comment]
        cannot :manage, :all
        can :manage, Todo
    end
   
  end # end of initialize()
end
