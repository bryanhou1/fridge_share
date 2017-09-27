Rails.application.routes.draw do

  resources :items
  resources :fridges
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  
  resource :user do
	  resources :items
	end

  root 'welcome#index'
  # get '/auth/facebook/callback' => 'sessions#create'
  get '/about' => 'welcome#about'
  get '/users' => 'users#index'


end
