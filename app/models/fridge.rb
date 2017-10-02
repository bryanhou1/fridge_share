class Fridge < ApplicationRecord
	has_many :items
	has_many :users, through: :items
	validates :name, presence: true, allow_blank: false
	def index
	end

  def fridge_form_identifier
    if name
      "#{id} - #{name}"
    else
      id
    end
  end
end
