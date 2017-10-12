Rails.application.routes.draw do

  resources :items
  resources :fridges
  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks", registrations: 'users/registrations'}
  
  resources :users, only: [:index, :show] do
	  resources :items, only: [:index, :show, :new]
	end

  root 'welcome#index'
  get '/about' => 'welcome#about'
  get '/users' => 'users#index'
  get '/expired_items' => 'items#show_expired'
  delete '/items' => 'items#destroy_collection'
end
