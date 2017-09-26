class CreateUserFridges < ActiveRecord::Migration[5.1]
  def change
    create_table :user_fridges do |t|

	    t.integer :user_id
	    t.integer :fridge_id

	    t.timestamps
	  end
  end
end
