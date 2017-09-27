class Fridge < ApplicationRecord
	has_many :items
	has_many :users, through: :items

	def index
	end
end
