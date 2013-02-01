class CreateAssignments < ActiveRecord::Migration
  def change
    create_table :assignments, :id => false do |t|

      t.references :user, :role
    end
  end
end
