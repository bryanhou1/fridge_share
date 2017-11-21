class FridgeComment < ApplicationRecord
	# in rails 5 required: true by default
	belongs_to :fridge
	belongs_to :user, required: false
end
