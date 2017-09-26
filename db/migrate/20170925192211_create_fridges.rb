class CreateFridges < ActiveRecord::Migration[5.1]
  def change
    create_table :fridges do |t|

      t.timestamps
    end
  end
end
