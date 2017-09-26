class Item < ApplicationRecord
	belongs_to :user
	belongs_to :fridge

	def index
	end
end
