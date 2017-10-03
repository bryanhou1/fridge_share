class Item < ApplicationRecord
	belongs_to :user
	belongs_to :fridge
	validates_with ExpirationDateValidator, attributes: :expiration_date
	validates :name, presence: true, allow_blank: false


	def self.expired_items
		expired_item_ids = all.collect { |item| 
			expiration_date_arr = item.expiration_date.scan(/.{1,2}/).map { |s| s.to_i }
			item.id if item.expired
		}.uniq.compact
		where(id: expired_item_ids)
	end

	def self.by_fridge_id
		order(:fridge_id)
	end
	
	def expired
		expiration_date_arr = expiration_date.scan(/.{1,2}/).map { |s| s.to_i }

		(expiration_date_arr[2] < Item.today[2] ||
		expiration_date_arr[2] == Item.today[2] && expiration_date_arr[0] < Item.today[0] ||
		expiration_date_arr[2] == Item.today[2] && expiration_date_arr[0] == Item.today[0] && expiration_date_arr[1] < Item.today[1])
	end

  def fridge_attributes=(fridge_attributes)
    if fridge_attributes.values.none? {|value| value == ""}
      fridge = Fridge.find_or_create_by(fridge_attributes)
      self.fridge = fridge
    end
  end
	private

	def self.today
		@today_date ||= Date.today
		[@today_date.mon, @today_date.day, @today_date.year-2000]
	end

end
