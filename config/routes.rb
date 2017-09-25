Rails.application.routes.draw do

  devise_for :users, :controllers => { :omniauth_callbacks => "users/omniauth_callbacks" }
  root 'welcome#index'
  # get '/auth/facebook/callback' => 'sessions#create'
  
  
end
