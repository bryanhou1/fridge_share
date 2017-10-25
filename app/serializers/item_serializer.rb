class ItemSerializer < ActiveModel::Serializer
  attributes :id, :name, :expiration_date
  belongs_to :user
  belongs_to :fridge
end
