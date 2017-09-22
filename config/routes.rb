Rails.application.routes.draw do

  devise_for :users
  root 'welcome#index'
  # get '/auth/facebook/callback' => 'sessions#create'
  
  
end
