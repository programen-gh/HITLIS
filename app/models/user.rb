class User < ApplicationRecord

  with_options presence: true do
    validates :nickname, length: { maximum: 20 }, uniqueness: true
    validates :password, length: { in: 6..20 }
  end
  
end
