Rails.application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  root 'welcome#index'
  # get '/auth/facebook/callback' => 'sessions#create'
  get '/about' => 'welcome#about'
  get '/fridges' => 'fridge#index'
  get '/users' => 'user#index'
  get '/items' => 'item#index'
  
end
