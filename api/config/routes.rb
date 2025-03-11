Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token
  namespace :api do
    namespace :v1 do
      resources :resumes
    end
  end
end
