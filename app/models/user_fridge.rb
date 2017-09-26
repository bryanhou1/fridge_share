class UserFridge < ApplicationRecord
	belongs_to :user
	belongs_to :fridge
end
