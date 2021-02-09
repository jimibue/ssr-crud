class User < ApplicationRecord
  validates :f_name, :l_name, length: { minimum: 2 }
end
