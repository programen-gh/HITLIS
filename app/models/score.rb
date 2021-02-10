class Score < ApplicationRecord

  with_options presence: true do
    validates :user_id
    validates :score
  end

  belongs_to :user
  
end
