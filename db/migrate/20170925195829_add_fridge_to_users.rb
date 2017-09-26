class AddFridgeToUsers < ActiveRecord::Migration[5.1]
  def change
    add_reference :users, :fridge, foreign_key: true, default: "1"
  end
end
