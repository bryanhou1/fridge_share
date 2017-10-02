class AddNameToFridge < ActiveRecord::Migration[5.1]
  def change
    add_column :fridges, :name, :string
  end
end
