class FridgeController < ApplicationController
	def index
		@fridges = Fridge.all
  end
end