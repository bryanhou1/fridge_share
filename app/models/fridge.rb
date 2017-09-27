class Fridge < ApplicationRecord
	has_many :user_fridges
	has_many :users, through: :user_fridges
	has_many :items

	def index
	end
end
