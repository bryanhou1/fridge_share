class ExpirationDateValidator < ActiveModel::EachValidator
  def validate(record)

    if wrong_length(record.expiration_date)
      record.errors.add(:expiration_date, "does not follow the proper format, MMDDYY.")
    elsif invalid_date(record.expiration_date)
      record.errors.add(:expiration_date, "is not a valid date. Please double check.")
    end

  end

  private
  	def wrong_length(attr)
  		attr.length != 6
  	end

  	def invalid_date(attr)
  		!(Date.strptime(attr,'%m%d%y') rescue nil)
  	end
end