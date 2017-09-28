class Item < ApplicationRecord
	belongs_to :user
	belongs_to :fridge
	validates_with ExpirationDateValidator, attributes: :expiration_date
end
