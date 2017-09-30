class Item < ApplicationRecord
	belongs_to :user
	belongs_to :fridge
	validates_with ExpirationDateValidator, attributes: :expiration_date


	def self.expired_items

		all.collect { |item| 
			expiration_date_arr = item.expiration_date.scan(/.{1,2}/).map { |s| s.to_i }
			item if item.expired
		}.uniq
	end

	def expired
		expiration_date_arr = expiration_date.scan(/.{1,2}/).map { |s| s.to_i }

		(expiration_date_arr[2] < Item.today[2] ||
		expiration_date_arr[2] == Item.today[2] && expiration_date_arr[0] < Item.today[0] ||
		expiration_date_arr[2] == Item.today[2] && expiration_date_arr[0] == Item.today[0] && expiration_date_arr[1] < Item.today[1])
	end

	private

	def self.today
		@today_date ||= Date.today
		[@today_date.mon, @today_date.day, @today_date.year-2000]
	end

end
