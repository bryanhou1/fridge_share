class CreateFridgeComments < ActiveRecord::Migration[5.1]
  def change
    create_table :fridge_comments do |t|
      t.integer :fridge_id
      t.integer :user_id
      t.string :comment
      t.timestamps
    end
  end
end
