class Fridge < ApplicationRecord
	has_many :users
	has_many :items, through: :users

	def index
	end
end
