class Fridge < ApplicationRecord
	has_many :items
  has_many :fridge_comments
	has_many :users, through: :items
	validates :name, presence: true, allow_blank: false

  def fridge_form_identifier
    if name
      "#{id} - #{name}"
    else
      id
    end
  end
end
