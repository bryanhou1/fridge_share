class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauth_providers => [:facebook]

  has_many :user_fridges
  has_many :fridges, through: :user_fridges
  has_many :items

  def self.from_omniauth(auth)
  	
	  where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      if auth.info.email.nil?
        user.email="#{auth.uid}@#{auth.provider}.com"
      else
        user.email = auth.info.email
      end
	    user.password = Devise.friendly_token[0,20]
	    user.name = auth.info.name
	    user.image = auth.info.image
	  end

  end

  def user_form_identifier
    if name
      "#{email} - #{name}"
    else
      email
    end
  end
end
