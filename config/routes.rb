Rails.application.routes.draw do

  resources :items


  resources :fridges
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks", registrations: 'users/registrations'}
  
  resources :users, only: [:index, :show] do
	  resources :items, only: [:index, :show]
	end

  root 'welcome#index'
  # get '/auth/facebook/callback' => 'sessions#create'
  get '/about' => 'welcome#about'
  get '/users' => 'users#index'

  delete '/items' => 'items#destroy_collection'
end
